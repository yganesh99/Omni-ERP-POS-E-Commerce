const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');
const creditService = require('./credit.service');
const { logAudit } = require('../middlewares/auditLog');

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
	businessId,
	storeId,
	{ customerId, items, paymentMethod, payments, notes },
	userId,
) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		let subtotal = 0;
		let taxAmount = 0;
		const orderItems = [];

		for (const item of items) {
			const product = await Product.findById(item.productId).session(
				session,
			);
			if (!product || String(product.businessId) !== String(businessId)) {
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

			// Decrement inventory
			const inv = await Inventory.findOneAndUpdate(
				{
					businessId,
					productId: item.productId,
					storeId,
					quantity: { $gte: item.quantity },
				},
				{ $inc: { quantity: -item.quantity } },
				{ new: true, session },
			);

			if (!inv) {
				throw Object.assign(
					new Error(`Insufficient stock for ${product.sku}`),
					{ status: 400 },
				);
			}

			const unitPrice = product.posPrice;
			const lineTax = unitPrice * item.quantity * (product.taxRate / 100);
			const lineTotal = unitPrice * item.quantity + lineTax;

			subtotal += unitPrice * item.quantity;
			taxAmount += lineTax;

			orderItems.push({
				productId: product._id,
				sku: product.sku,
				name: product.name,
				quantity: item.quantity,
				unitPrice,
				taxRate: product.taxRate,
				taxAmount: lineTax,
				lineTotal,
			});
		}

		const totalAmount = subtotal + taxAmount;
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
					businessId,
					storeId,
					customerId: customerId || null,
					orderNumber: generateOrderNumber(),
					channel: 'pos',
					status: 'confirmed',
					items: orderItems,
					subtotal,
					taxAmount,
					totalAmount,
					paymentMethod,
					payments: payments || [],
					creditUsed,
					notes,
					createdBy: userId,
				},
			],
			{ session },
		);

		// Record credit if applicable
		if (paymentMethod === 'credit' && customerId) {
			await creditService.recordCreditSale(
				businessId,
				customerId,
				creditUsed,
				order[0]._id,
				userId,
			);
		}

		await session.commitTransaction();

		logAudit({
			businessId,
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
 * Process a POS refund.
 */
async function processRefund(businessId, orderId, { items, reason }, userId) {
	const order = await Order.findById(orderId);
	if (!order || String(order.businessId) !== String(businessId)) {
		throw Object.assign(new Error('Order not found'), { status: 404 });
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		let refundTotal = 0;

		for (const item of items) {
			const orderItem = order.items.find(
				(oi) => String(oi.productId) === String(item.productId),
			);
			if (!orderItem) {
				throw Object.assign(new Error(`Item not in original order`), {
					status: 400,
				});
			}

			// Restock
			await Inventory.findOneAndUpdate(
				{
					businessId,
					productId: item.productId,
					storeId: order.storeId,
				},
				{ $inc: { quantity: item.quantity } },
				{ upsert: true, setDefaultsOnInsert: true, session },
			);

			refundTotal += orderItem.unitPrice * item.quantity;
		}

		// Reduce credit if credit order
		if (order.paymentMethod === 'credit' && order.customerId) {
			await creditService.recordCustomerReturn(
				businessId,
				order.customerId,
				refundTotal,
				orderId,
				userId,
			);
		}

		order.status = 'returned';
		await order.save({ session });

		await session.commitTransaction();

		logAudit({
			businessId,
			userId,
			action: 'pos_refund',
			entity: 'Order',
			entityId: orderId,
			changes: { refundTotal, reason },
		});

		return { orderId, refundTotal };
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

module.exports = { createOrder, processRefund };
