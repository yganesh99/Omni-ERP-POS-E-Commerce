const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = [
	'admin',
	'store_manager',
	'inventory_manager',
	'accountant',
	'cashier',
	'customer',
];

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, select: false },
		googleId: { type: String, unique: true, sparse: true },
		name: { type: String, required: true },
		phone: { type: String },
		role: {
			type: String,
			enum: ROLES,
			required: true,
			default: 'cashier',
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			default: null,
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

// hash password before save
userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || !this.password) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

userSchema.methods.comparePassword = function (candidate) {
	return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
