const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		logo: { type: String },
		address: {
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
		phone: { type: String },
		email: { type: String, lowercase: true, trim: true },
		taxId: { type: String },
		settings: {
			currency: { type: String, default: 'USD' },
			stockLockTTLMinutes: { type: Number, default: 15 },
			defaultTaxRate: { type: Number, default: 0 },
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Business', businessSchema);
