const mongoose = require('mongoose');
const PurchaseOrder = require('../models/purchaseOrder.model');
const Inventory = require('../models/inventory.model');
const { logAudit } = require('../middlewares/auditLog');

function generatePONumber() {
	const ts = Date.now().toString(36).toUpperCase();
	const rand = Math.random().toString(36).substring(2, 4).toUpperCase();
	return `PO-${ts}-${rand}`;
}

async function create(businessId, data, userId) {
	let totalAmount = 0;
	const items = data.items.map((item) => {
		const lineTotal = item.orderedQty * item.unitPrice;
		totalAmount += lineTotal;
		return { ...item, receivedQty: 0, lineTotal };
	});

	return PurchaseOrder.create({
		businessId,
		supplierId: data.supplierId,
		storeId: data.storeId,
		poNumber: generatePONumber(),
		status: 'draft',
		items,
		totalAmount,
		notes: data.notes,
		createdBy: userId,
	});
}

async function getByBusiness(
	businessId,
	{ status, supplierId, page = 1, limit = 50 } = {},
) {
	const query = { businessId };
	if (status) query.status = status;
	if (supplierId) query.supplierId = supplierId;

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		PurchaseOrder.find(query)
			.populate('supplierId', 'name')
			.populate('storeId', 'name code')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		PurchaseOrder.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return PurchaseOrder.findById(id)
		.populate('supplierId', 'name contactPerson email phone')
		.populate('storeId', 'name code address');
}

async function approve(id, userId) {
	return PurchaseOrder.findByIdAndUpdate(
		id,
		{ status: 'approved', approvedBy: userId },
		{ new: true },
	);
}

async function markSent(id) {
	return PurchaseOrder.findByIdAndUpdate(
		id,
		{ status: 'sent' },
		{ new: true },
	);
}

/**
 * Receive delivery (partial or full).
 * Updates receivedQty for each item, adds to inventory, and updates PO status.
 */
async function receiveDelivery(id, receivedItems, userId) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const po = await PurchaseOrder.findById(id).session(session);
		if (!po)
			throw Object.assign(new Error('PO not found'), { status: 404 });

		for (const recv of receivedItems) {
			const poItem = po.items.find(
				(i) => String(i.productId) === String(recv.productId),
			);
			if (!poItem) {
				throw Object.assign(
					new Error(`Product ${recv.productId} not in PO`),
					{ status: 400 },
				);
			}

			if (poItem.receivedQty + recv.quantity > poItem.orderedQty) {
				throw Object.assign(
					new Error(
						`Received qty exceeds ordered qty for ${poItem.sku}`,
					),
					{ status: 400 },
				);
			}

			poItem.receivedQty += recv.quantity;

			// Add to inventory
			await Inventory.findOneAndUpdate(
				{
					businessId: po.businessId,
					productId: recv.productId,
					storeId: po.storeId,
				},
				{ $inc: { quantity: recv.quantity } },
				{ upsert: true, setDefaultsOnInsert: true, session },
			);
		}

		// Check if all items fully received
		const allReceived = po.items.every(
			(i) => i.receivedQty >= i.orderedQty,
		);
		po.status = allReceived ? 'closed' : 'partial_received';
		await po.save({ session });

		await session.commitTransaction();

		logAudit({
			businessId: po.businessId,
			userId,
			action: 'po_receive',
			entity: 'PurchaseOrder',
			entityId: id,
			changes: { receivedItems, newStatus: po.status },
		});

		return po;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

async function cancel(id) {
	return PurchaseOrder.findByIdAndUpdate(
		id,
		{ status: 'cancelled' },
		{ new: true },
	);
}

module.exports = {
	create,
	getByBusiness,
	getById,
	approve,
	markSent,
	receiveDelivery,
	cancel,
};
