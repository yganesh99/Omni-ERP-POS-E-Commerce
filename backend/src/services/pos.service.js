const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');
const RegisterSession = require('../models/registerSession.model');
const Return = require('../models/return.model');
const creditService = require('./credit.service');
const { logAudit } = require('../middlewares/auditLog');
const { calculateDiscount } = require('../utils/discount.util');
const { normalizeQuantity } = require('../utils/quantityByUnit');

/**
 * Generate a unique order number.
 */
function generateOrderNumber() {
	const ts = Date.now().toString(36).toUpperCase();
	const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `POS-${ts}-${rand}`;
}

/**
 * Create a POS order (cash / card / QR / split / credit).
 */
async function createOrder(
	storeId,
	{
		customerId,
		items,
		paymentMethod,
		payments,
		notes,
		sessionId,
		discountType,
		discountValue,
	},
	userId,
) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (!sessionId) {
			throw Object.assign(
				new Error('Register session required for POS order'),
				{ status: 400 },
			);
		}

		const activeSession = await RegisterSession.findOne({
			_id: sessionId,
			status: 'open',
		}).session(session);
		if (!activeSession) {
			throw Object.assign(
				new Error('Invalid or closed register session'),
				{ status: 400 },
			);
		}

		let subtotal = 0;
		let taxAmount = 0;
		const orderItems = [];

		for (const item of items) {
			const product = await Product.findById(item.productId).session(
				session,
			);
			if (!product) {
				throw Object.assign(
					new Error(`Product ${item.productId} not found`),
					{ status: 404 },
				);
			}
			if (product.visibility === 'ecommerce_only') {
				throw Object.assign(
					new Error(`Product ${product.sku} is ecommerce-only`),
					{ status: 400 },
				);
			}

			const qty = normalizeQuantity(item.quantity, product.unit);

			// Decrement inventory
			const inv = await Inventory.findOneAndUpdate(
				{
					productId: item.productId,
					storeId,
					quantity: { $gte: qty },
				},
				{ $inc: { quantity: -qty } },
				{ new: true, session },
			);

			if (!inv) {
				throw Object.assign(
					new Error(`Insufficient stock for ${product.sku}`),
					{ status: 400 },
				);
			}

			const unitPrice = product.posPrice;
			const lineTax = unitPrice * qty * (product.taxRate / 100);
			const lineTotal = unitPrice * qty + lineTax;

			subtotal += unitPrice * qty;
			taxAmount += lineTax;

			orderItems.push({
				productId: product._id,
				sku: product.sku,
				name: product.name,
				quantity: qty,
				unit: product.unit || 'pcs',
				unitPrice,
				taxRate: product.taxRate,
				taxAmount: lineTax,
				lineTotal,
			});
		}

		const discountAmount = calculateDiscount(
			subtotal,
			discountType,
			discountValue,
		);
		const totalAmount = subtotal + taxAmount - discountAmount;
		let creditUsed = 0;

		// Validate credit if credit payment
		if (paymentMethod === 'credit') {
			if (!customerId) {
				throw Object.assign(
					new Error('Customer required for credit sale'),
					{ status: 400 },
				);
			}
			creditUsed = totalAmount;
		}

		const order = await Order.create(
			[
				{
					storeId,
					customerId: customerId || null,
					orderNumber: generateOrderNumber(),
					channel: 'pos',
					status: 'confirmed',
					items: orderItems,
					subtotal,
					taxAmount,
					discountType: discountType || null,
					discountValue: discountValue || 0,
					discountAmount,
					totalAmount,
					paymentMethod,
					payments: payments || [],
					creditUsed,
					notes,
					sessionId,
					createdBy: userId,
				},
			],
			{ session },
		);

		// Record credit if applicable
		if (paymentMethod === 'credit' && customerId) {
			await creditService.recordCreditSale(
				customerId,
				creditUsed,
				order[0]._id,
				userId,
			);
		}

		await session.commitTransaction();

		logAudit({
			userId,
			action: 'pos_sale',
			entity: 'Order',
			entityId: order[0]._id,
			changes: { totalAmount, paymentMethod, items: orderItems.length },
		});

		return order[0];
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

/**
 * Generate a quote for a POS cart without creating an order record.
 */
async function generateQuote(
	storeId,
	{ customerId, items, notes, discountType, discountValue },
	userId,
) {
	let subtotal = 0;
	let taxAmount = 0;
	const orderItems = [];

	for (const item of items) {
		const product = await Product.findById(item.productId);
		if (!product) {
			throw Object.assign(
				new Error(`Product ${item.productId} not found`),
				{ status: 404 },
			);
		}
		if (product.visibility === 'ecommerce_only') {
			throw Object.assign(
				new Error(`Product ${product.sku} is ecommerce-only`),
				{ status: 400 },
			);
		}

		const qty = normalizeQuantity(item.quantity, product.unit);
		const unitPrice = product.posPrice;
		const lineTax = unitPrice * qty * (product.taxRate / 100);
		const lineTotal = unitPrice * qty + lineTax;

		subtotal += unitPrice * qty;
		taxAmount += lineTax;

		orderItems.push({
			productId: product._id,
			sku: product.sku,
			name: product.name,
			quantity: qty,
			unit: product.unit || 'pcs',
			unitPrice,
			taxRate: product.taxRate,
			taxAmount: lineTax,
			lineTotal,
		});
	}

	const discountAmount = calculateDiscount(
		subtotal,
		discountType,
		discountValue,
	);
	const totalAmount = subtotal + taxAmount - discountAmount;

	// Build an order-like object for PDF generation only (not persisted).
	const quote = {
		storeId,
		customerId: customerId || null,
		orderNumber: generateOrderNumber(),
		channel: 'pos',
		status: 'pending',
		items: orderItems,
		subtotal,
		taxAmount,
		discountType: discountType || null,
		discountValue: discountValue || 0,
		discountAmount,
		totalAmount,
		paymentMethod: 'cash',
		payments: [],
		creditUsed: 0,
		notes,
		sessionId: null,
		createdBy: userId,
		createdAt: new Date(),
		isQuote: true,
	};

	return quote;
}

/**
 * Get returned quantities per product for an order (from Return documents).
 */
async function getReturnedQuantitiesByOrder(orderId) {
	const returns = await Return.find({
		orderId,
		type: 'customer',
		status: 'completed',
	}).lean();
	const byProduct = {};
	for (const r of returns) {
		for (const line of r.items || []) {
			const id = String(line.productId);
			byProduct[id] = (byProduct[id] || 0) + line.quantity;
		}
	}
	return byProduct;
}

/**
 * Process a POS return (partial) or refund (full order).
 * Creates a Return document, restocks inventory, updates order status to
 * partially_returned or refunded. Multiple partial returns allowed until
 * all items are returned.
 */
async function processRefund(orderId, { items, reason }, userId) {
	const order = await Order.findById(orderId);
	if (!order) {
		throw Object.assign(new Error('Order not found'), { status: 404 });
	}
	if (order.status === 'refunded' || order.status === 'returned') {
		throw Object.assign(new Error('Order is already fully refunded'), {
			status: 400,
		});
	}

	const returnedSoFar = await getReturnedQuantitiesByOrder(orderId);
	const remainingByProduct = {};
	for (const item of order.items) {
		const id = String(item.productId);
		const returned = returnedSoFar[id] || 0;
		remainingByProduct[id] = Math.max(0, item.quantity - returned);
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		let refundTotal = 0;
		const returnItems = [];

		for (const item of items) {
			const orderItem = order.items.find(
				(oi) => String(oi.productId) === String(item.productId),
			);
			if (!orderItem) {
				throw Object.assign(new Error(`Item not in original order`), {
					status: 400,
				});
			}
			const remaining = remainingByProduct[String(item.productId)] ?? 0;
			if (item.quantity > remaining) {
				throw Object.assign(
					new Error(
						`Cannot return more than ${remaining} of ${orderItem.name} (already returned: ${returnedSoFar[String(item.productId)] || 0})`,
					),
					{ status: 400 },
				);
			}

			// Restock
			await Inventory.findOneAndUpdate(
				{
					productId: item.productId,
					storeId: order.storeId,
				},
				{ $inc: { quantity: item.quantity } },
				{ upsert: true, setDefaultsOnInsert: true, session },
			);

			const lineTotal = orderItem.unitPrice * item.quantity;
			refundTotal += lineTotal;
			returnItems.push({
				productId: orderItem.productId,
				quantity: item.quantity,
				unitPrice: orderItem.unitPrice,
				lineTotal,
			});
		}

		// Reduce credit if credit order
		if (order.paymentMethod === 'credit' && order.customerId) {
			await creditService.recordCustomerReturn(
				order.customerId,
				refundTotal,
				orderId,
				userId,
			);
		}

		const returnDoc = await Return.create(
			[
				{
					type: 'customer',
					entityId: order.customerId || order._id,
					orderId: order._id,
					storeId: order.storeId,
					items: returnItems,
					totalAmount: refundTotal,
					reason: reason || undefined,
					status: 'completed',
					createdBy: userId,
				},
			],
			{ session },
		);

		// Update returned counts and decide order status
		for (const item of items) {
			const id = String(item.productId);
			returnedSoFar[id] = (returnedSoFar[id] || 0) + item.quantity;
		}
		const allReturned = order.items.every(
			(oi) => (returnedSoFar[String(oi.productId)] || 0) >= oi.quantity,
		);
		order.status = allReturned ? 'refunded' : 'partially_returned';
		await order.save({ session });

		await session.commitTransaction();

		logAudit({
			userId,
			action: allReturned ? 'pos_refund' : 'pos_return',
			entity: 'Order',
			entityId: orderId,
			changes: { refundTotal, reason, returnId: returnDoc[0]._id },
		});

		return {
			orderId,
			refundTotal,
			returnId: returnDoc[0]._id,
			orderStatus: order.status,
			isFullRefund: allReturned,
		};
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

/**
 * List returns for a POS order (for computing remaining returnable quantities).
 * For legacy 'returned' or 'refunded' orders with no Return docs, treat all as returned.
 */
async function getReturnsByOrderId(orderId) {
	const order = await Order.findById(orderId);
	if (!order) return null;
	const returns = await Return.find({
		orderId,
		type: 'customer',
	})
		.sort({ createdAt: 1 })
		.lean();
	let returnedByProduct = await getReturnedQuantitiesByOrder(orderId);
	// Legacy orders: status 'returned' means full refund with no Return docs
	if (
		(order.status === 'returned' || order.status === 'refunded') &&
		returns.length === 0
	) {
		returnedByProduct = {};
		for (const item of order.items) {
			returnedByProduct[String(item.productId)] = item.quantity;
		}
	}
	return {
		order,
		returns,
		returnedByProduct,
	};
}

module.exports = {
	createOrder,
	generateQuote,
	processRefund,
	getReturnsByOrderId,
};
