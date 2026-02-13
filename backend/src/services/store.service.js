const Store = require('../models/store.model');

async function create(data) {
	return Store.create(data);
}

async function getByBusiness(businessId) {
	return Store.find({ businessId, isActive: true }).sort({ name: 1 });
}

async function getById(id) {
	return Store.findById(id);
}

async function update(id, data) {
	return Store.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function toggleActive(id) {
	const store = await Store.findById(id);
	if (!store) return null;
	store.isActive = !store.isActive;
	return store.save();
}

module.exports = { create, getByBusiness, getById, update, toggleActive };
