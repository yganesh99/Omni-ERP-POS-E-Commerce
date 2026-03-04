const Order = require('../models/order.model');

async function getAll(
	{ channel, status, customerId, page = 1, limit = 50 } = {},
) {
	const query = {};
	if (channel) query.channel = channel;
	if (status) query.status = status;
	if (customerId) query.customerId = customerId;

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Order.find(query)
			.populate('customerId', 'name email')
			.populate('storeId', 'name code')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		Order.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return Order.findById(id)
		.populate('customerId', 'name email phone')
		.populate('storeId', 'name code address');
}

async function updateStatus(id, status) {
	return Order.findByIdAndUpdate(id, { status }, { new: true });
}

module.exports = { getAll, getById, updateStatus };
