const mongoose = require('mongoose');
const Inventory = require('../models/inventory.model');
const InventoryTransfer = require('../models/inventoryTransfer.model');
const StockLock = require('../models/stockLock.model');
const { logAudit } = require('../middlewares/auditLog');

/**
 * Get stock levels. Optionally filter by store and/or product.
 */
async function getStock({ storeId, productId } = {}) {
	const query = {};
	if (storeId) query.storeId = storeId;
	if (productId) query.productId = productId;
	return Inventory.find(query)
		.populate('productId', 'name sku')
		.populate('storeId', 'name code');
}

/**
 * Get total available stock for a product across all stores.
 */
async function getTotalAvailable(productId) {
	const records = await Inventory.find({ productId });
	return records.reduce(
		(sum, r) => sum + (r.quantity - r.reservedQuantity),
		0,
	);
}

/**
 * Adjust stock (manual adjustment with audit trail).
 */
async function adjustStock(productId, storeId, quantityChange, userId) {
	const inv = await Inventory.findOneAndUpdate(
		{ productId, storeId },
		{ $inc: { quantity: quantityChange } },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	);

	if (inv.quantity < 0) {
		// rollback
		await Inventory.findOneAndUpdate(
			{ productId, storeId },
			{ $inc: { quantity: -quantityChange } },
		);
		const err = new Error('Adjustment would result in negative stock');
		err.status = 400;
		throw err;
	}

	logAudit({
		userId,
		action: 'adjust',
		entity: 'Inventory',
		entityId: inv._id,
		changes: { quantityChange, newQuantity: inv.quantity },
	});

	return inv;
}

/**
 * Transfer stock between stores (atomic via Mongoose transaction).
 */
async function transferStock(fromStoreId, toStoreId, items, userId) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		for (const item of items) {
			// Decrement source
			const source = await Inventory.findOneAndUpdate(
				{
					productId: item.productId,
					storeId: fromStoreId,
					quantity: { $gte: item.quantity },
				},
				{ $inc: { quantity: -item.quantity } },
				{ new: true, session },
			);

			if (!source) {
				throw new Error(
					`Insufficient stock for product ${item.productId} in source store`,
				);
			}

			// Increment destination
			await Inventory.findOneAndUpdate(
				{
					productId: item.productId,
					storeId: toStoreId,
				},
				{ $inc: { quantity: item.quantity } },
				{ new: true, upsert: true, setDefaultsOnInsert: true, session },
			);
		}

		const transfer = await InventoryTransfer.create(
			[
				{
					fromStoreId,
					toStoreId,
					items,
					status: 'completed',
					createdBy: userId,
				},
			],
			{ session },
		);

		await session.commitTransaction();

		logAudit({
			userId,
			action: 'transfer',
			entity: 'InventoryTransfer',
			entityId: transfer[0]._id,
			changes: { fromStoreId, toStoreId, items },
		});

		return transfer[0];
	} catch (err) {
		await session.abortTransaction();
		if (!err.status) err.status = 400;
		throw err;
	} finally {
		session.endSession();
	}
}

/**
 * Soft-lock stock for ecommerce checkout.
 */
async function lockStock(storeId, items, sessionId, ttlMinutes = 15) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const locks = [];
		for (const item of items) {
			// Check available
			const inv = await Inventory.findOne({
				productId: item.productId,
				storeId,
			}).session(session);

			if (!inv || inv.quantity - inv.reservedQuantity < item.quantity) {
				throw new Error(
					`Insufficient stock for product ${item.productId}`,
				);
			}

			// Reserve
			await Inventory.updateOne(
				{ _id: inv._id },
				{ $inc: { reservedQuantity: item.quantity } },
				{ session },
			);

			const lock = await StockLock.create(
				[
					{
						productId: item.productId,
						storeId,
						quantity: item.quantity,
						sessionId,
						expiresAt: new Date(
							Date.now() + ttlMinutes * 60 * 1000,
						),
						status: 'active',
					},
				],
				{ session },
			);
			locks.push(lock[0]);
		}

		await session.commitTransaction();
		return locks;
	} catch (err) {
		await session.abortTransaction();
		if (!err.status) err.status = 400;
		throw err;
	} finally {
		session.endSession();
	}
}

/**
 * Release stock locks (timeout or cancellation).
 */
async function releaseStock(sessionId) {
	const locks = await StockLock.find({
		sessionId,
		status: 'active',
	});

	for (const lock of locks) {
		await Inventory.updateOne(
			{
				productId: lock.productId,
				storeId: lock.storeId,
			},
			{ $inc: { reservedQuantity: -lock.quantity } },
		);
		lock.status = 'released';
		await lock.save();
	}

	return locks;
}

/**
 * Confirm stock locks (payment successful).
 */
async function confirmStock(sessionId) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const locks = await StockLock.find({
			sessionId,
			status: 'active',
		}).session(session);

		for (const lock of locks) {
			// Decrement real quantity and reserved
			await Inventory.updateOne(
				{
					productId: lock.productId,
					storeId: lock.storeId,
				},
				{
					$inc: {
						quantity: -lock.quantity,
						reservedQuantity: -lock.quantity,
					},
				},
				{ session },
			);
			lock.status = 'confirmed';
			await lock.save({ session });
		}

		await session.commitTransaction();
		return locks;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

/**
 * Ensure / initialize inventory record for a product at a store.
 */
async function ensureRecord(productId, storeId) {
	return Inventory.findOneAndUpdate(
		{ productId, storeId },
		{ $setOnInsert: { quantity: 0, reservedQuantity: 0 } },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);
}

/**
 * Cleanup expired stock locks that are still marked 'active'.
 * Decrements reservedQuantity on the corresponding Inventory record
 * and marks the lock as 'expired'.
 *
 * This runs periodically to close the gap where MongoDB TTL index
 * deletes the StockLock document without adjusting inventory.
 */
async function cleanupExpiredLocks() {
	const expiredLocks = await StockLock.find({
		status: 'active',
		expiresAt: { $lte: new Date() },
	});

	if (expiredLocks.length === 0) return;

	console.log(
		`[StockLock Cleanup] Processing ${expiredLocks.length} expired lock(s)`,
	);

	for (const lock of expiredLocks) {
		try {
			await Inventory.updateOne(
				{
					productId: lock.productId,
					storeId: lock.storeId,
				},
				{ $inc: { reservedQuantity: -lock.quantity } },
			);
			lock.status = 'expired';
			await lock.save();
		} catch (err) {
			console.error(
				`[StockLock Cleanup] Failed to release lock ${lock._id}:`,
				err.message,
			);
		}
	}
}

module.exports = {
	getStock,
	getTotalAvailable,
	adjustStock,
	transferStock,
	lockStock,
	releaseStock,
	confirmStock,
	ensureRecord,
	cleanupExpiredLocks,
};
