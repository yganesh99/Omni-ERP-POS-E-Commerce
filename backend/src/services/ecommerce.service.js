const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const inventoryService = require('./inventory.service');
const creditService = require('./credit.service');
const { logAudit } = require('../middlewares/auditLog');

function generateOrderNumber() {
	const ts = Date.now().toString(36).toUpperCase();
	const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `ECM-${ts}-${rand}`;
}

/**
 * Ecommerce checkout: soft-lock stock & create pending order.
 */
async function checkout(
	businessId,
	storeId,
	{ customerId, items, sessionId },
	ttlMinutes = 15,
) {
	// Validate products and build order items
	const orderItems = [];
	let subtotal = 0;
	let taxAmount = 0;

	for (const item of items) {
		const product = await Product.findById(item.productId);
		if (!product || String(product.businessId) !== String(businessId)) {
			throw Object.assign(
				new Error(`Product ${item.productId} not found`),
				{ status: 404 },
			);
		}
		if (product.visibility === 'pos_only') {
			throw Object.assign(
				new Error(`Product ${product.sku} is POS-only`),
				{ status: 400 },
			);
		}

		const unitPrice = product.ecommercePrice;
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

	// Lock stock
	await inventoryService.lockStock(
		businessId,
		storeId,
		items,
		sessionId,
		ttlMinutes,
	);

	// Create pending order
	const order = await Order.create({
		businessId,
		storeId,
		customerId: customerId || null,
		orderNumber: generateOrderNumber(),
		channel: 'ecommerce',
		status: 'pending',
		items: orderItems,
		subtotal,
		taxAmount,
		totalAmount: subtotal + taxAmount,
		paymentMethod: 'card',
		sessionId,
	});

	return order;
}

/**
 * Confirm ecommerce order after payment.
 */
async function confirmPayment(orderId, { paymentMethod, payments }) {
	const order = await Order.findById(orderId);
	if (!order)
		throw Object.assign(new Error('Order not found'), { status: 404 });
	if (order.status !== 'pending') {
		throw Object.assign(new Error('Order is not pending'), { status: 400 });
	}

	// Confirm stock locks
	await inventoryService.confirmStock(order.sessionId);

	order.status = 'confirmed';
	order.paymentMethod = paymentMethod || order.paymentMethod;
	order.payments = payments || order.payments;
	await order.save();

	logAudit({
		businessId: order.businessId,
		userId: null,
		action: 'ecommerce_confirm',
		entity: 'Order',
		entityId: order._id,
		changes: { paymentMethod, totalAmount: order.totalAmount },
	});

	return order;
}

/**
 * Assign fulfillment store to ecommerce order.
 */
async function assignStore(orderId, storeId) {
	return Order.findByIdAndUpdate(
		orderId,
		{ fulfilledBy: storeId, status: 'processing' },
		{ new: true },
	);
}

/**
 * Process ecommerce return at a store.
 */
async function processReturn(
	businessId,
	orderId,
	{ items, storeId, reason },
	userId,
) {
	const order = await Order.findById(orderId);
	if (!order || String(order.businessId) !== String(businessId)) {
		throw Object.assign(new Error('Order not found'), { status: 404 });
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		let returnTotal = 0;

		for (const item of items) {
			const orderItem = order.items.find(
				(oi) => String(oi.productId) === String(item.productId),
			);
			if (!orderItem) {
				throw Object.assign(new Error('Item not in original order'), {
					status: 400,
				});
			}

			// Restock at the return store
			await inventoryService.adjustStock(
				businessId,
				item.productId,
				storeId,
				item.quantity,
				userId,
			);

			returnTotal += orderItem.unitPrice * item.quantity;
		}

		// Update credit if needed
		if (order.customerId && order.creditUsed > 0) {
			await creditService.recordCustomerReturn(
				businessId,
				order.customerId,
				returnTotal,
				orderId,
				userId,
			);
		}

		await session.commitTransaction();

		logAudit({
			businessId,
			userId,
			action: 'ecommerce_return',
			entity: 'Order',
			entityId: orderId,
			changes: { returnTotal, reason },
		});

		return { orderId, returnTotal };
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

module.exports = { checkout, confirmPayment, assignStore, processReturn };
