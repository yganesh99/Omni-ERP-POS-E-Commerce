const Business = require('../models/business.model');

async function create(data) {
	return Business.create(data);
}

async function getAll(filter = {}) {
	return Business.find(filter).sort({ createdAt: -1 });
}

async function getById(id) {
	return Business.findById(id);
}

async function update(id, data) {
	return Business.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function toggleActive(id) {
	const biz = await Business.findById(id);
	if (!biz) return null;
	biz.isActive = !biz.isActive;
	return biz.save();
}

module.exports = { create, getAll, getById, update, toggleActive };
