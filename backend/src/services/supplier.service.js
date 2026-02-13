const Supplier = require('../models/supplier.model');

async function create(data) {
	return Supplier.create(data);
}

async function getByBusiness(
	businessId,
	{ search, page = 1, limit = 50 } = {},
) {
	const query = { businessId, isActive: true };
	if (search) {
		query.$or = [
			{ name: { $regex: search, $options: 'i' } },
			{ contactPerson: { $regex: search, $options: 'i' } },
		];
	}
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Supplier.find(query).sort({ name: 1 }).skip(skip).limit(limit),
		Supplier.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return Supplier.findById(id);
}

async function update(id, data) {
	return Supplier.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

module.exports = { create, getByBusiness, getById, update };
