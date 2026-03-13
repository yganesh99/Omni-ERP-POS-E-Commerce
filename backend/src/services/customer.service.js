const Customer = require('../models/customer.model');

async function create(data) {
	// Check for unique name
	if (data.name) {
		const existingName = await Customer.findOne({
			name: { $regex: new RegExp(`^${data.name}$`, 'i') },
		});
		if (existingName) {
			const err = new Error('A customer with this name already exists.');
			err.status = 400;
			throw err;
		}
	}

	// Check for unique email (ignore empty strings)
	if (data.email && data.email.trim() !== '') {
		const existingEmail = await Customer.findOne({
			email: { $regex: new RegExp(`^${data.email}$`, 'i') },
		});
		if (existingEmail) {
			const err = new Error('A customer with this email already exists.');
			err.status = 400;
			throw err;
		}
	}

	return Customer.create(data);
}

async function getAll({ search, page = 1, limit = 50 } = {}) {
	const query = { isActive: true };
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
	// Check for unique name, excluding the current customer
	if (data.name) {
		const existingName = await Customer.findOne({
			_id: { $ne: id },
			name: { $regex: new RegExp(`^${data.name}$`, 'i') },
		});
		if (existingName) {
			const err = new Error('A customer with this name already exists.');
			err.status = 400;
			throw err;
		}
	}

	// Check for unique email, excluding the current customer (ignore empty)
	if (data.email && data.email.trim() !== '') {
		const existingEmail = await Customer.findOne({
			_id: { $ne: id },
			email: { $regex: new RegExp(`^${data.email}$`, 'i') },
		});
		if (existingEmail) {
			const err = new Error('A customer with this email already exists.');
			err.status = 400;
			throw err;
		}
	}

	if (data.creditLimit !== undefined) {
		const customer = await Customer.findById(id);
		if (!customer) {
			const err = new Error('Customer not found');
			err.status = 404;
			throw err;
		}

		if (
			customer.currentBalance > 0 &&
			customer.creditLimit !== data.creditLimit
		) {
			const err = new Error(
				'Cannot update credit limit while there is an outstanding balance.',
			);
			err.status = 400;
			throw err;
		}
	}

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

module.exports = { create, getAll, getById, update, checkCredit };
