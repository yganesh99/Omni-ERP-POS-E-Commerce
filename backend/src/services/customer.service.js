const Customer = require('../models/customer.model');

async function create(data) {
	return Customer.create(data);
}

async function getByBusiness(
	businessId,
	{ search, page = 1, limit = 50 } = {},
) {
	const query = { businessId, isActive: true };
	if (search) {
		query.$or = [
			{ name: { $regex: search, $options: 'i' } },
			{ email: { $regex: search, $options: 'i' } },
			{ phone: { $regex: search, $options: 'i' } },
		];
	}
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Customer.find(query).sort({ name: 1 }).skip(skip).limit(limit),
		Customer.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return Customer.findById(id);
}

async function update(id, data) {
	return Customer.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function checkCredit(customerId, amount) {
	const customer = await Customer.findById(customerId);
	if (!customer) {
		const err = new Error('Customer not found');
		err.status = 404;
		throw err;
	}
	return customer.creditLimit - customer.currentBalance >= amount;
}

module.exports = { create, getByBusiness, getById, update, checkCredit };
