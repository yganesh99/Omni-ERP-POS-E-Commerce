const Tax = require('../models/tax.model');

async function create(data) {
	return Tax.create(data);
}

async function getByBusiness(businessId) {
	return Tax.find({ businessId, isActive: true }).sort({ name: 1 });
}

async function getById(id) {
	return Tax.findById(id);
}

async function update(id, data) {
	return Tax.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function getDefault(businessId) {
	return Tax.findOne({ businessId, isDefault: true, isActive: true });
}

module.exports = { create, getByBusiness, getById, update, getDefault };
