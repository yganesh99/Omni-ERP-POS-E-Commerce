const Payment = require('../models/payment.model');

async function create(data) {
	return Payment.create(data);
}

async function getByEntity(businessId, entityType, entityId) {
	return Payment.find({ businessId, entityType, entityId }).sort({
		createdAt: -1,
	});
}

async function getByBusiness(
	businessId,
	{ entityType, page = 1, limit = 50 } = {},
) {
	const query = { businessId };
	if (entityType) query.entityType = entityType;

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
		Payment.countDocuments(query),
	]);
	return { items, total, page, limit };
}

module.exports = { create, getByEntity, getByBusiness };
