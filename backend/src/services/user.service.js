const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function createUser(data) {
	const existing = await User.findOne({ email: data.email });
	if (existing) {
		const err = new Error('Email already in use');
		err.status = 409;
		throw err;
	}
	return User.create(data);
}

async function getAll( filter = {}) {
	return User.find({ ...filter }).sort({ name: 1 });
}

async function getById(id) {
	return User.findById(id);
}

async function update(id, data) {
	// Don't allow direct password updates through here
	delete data.password;
	return User.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function toggleActive(id) {
	const user = await User.findById(id);
	if (!user) return null;
	user.isActive = !user.isActive;
	return user.save();
}

async function changePassword(id, newPassword) {
	const user = await User.findById(id).select('+password');
	if (!user) return null;
	user.password = newPassword;
	return user.save();
}

module.exports = {
	createUser,
	getAll,
	getById,
	update,
	toggleActive,
	changePassword,
};
