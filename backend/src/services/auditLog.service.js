const AuditLog = require('../models/auditLog.model');

async function getByBusiness(
	businessId,
	{ entity, action, userId, startDate, endDate, page = 1, limit = 50 } = {},
) {
	const query = { businessId };
	if (entity) query.entity = entity;
	if (action) query.action = action;
	if (userId) query.userId = userId;
	if (startDate || endDate) {
		query.createdAt = {};
		if (startDate) query.createdAt.$gte = new Date(startDate);
		if (endDate) query.createdAt.$lte = new Date(endDate);
	}

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		AuditLog.find(query)
			.populate('userId', 'name email')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		AuditLog.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getByEntity(businessId, entity, entityId) {
	return AuditLog.find({ businessId, entity, entityId })
		.populate('userId', 'name email')
		.sort({ createdAt: -1 });
}

module.exports = { getByBusiness, getByEntity };
