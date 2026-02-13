const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
			index: true,
		},
		name: { type: String, required: true, trim: true },
		contactPerson: { type: String, trim: true },
		email: { type: String, lowercase: true, trim: true },
		phone: { type: String },
		address: {
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
		leadTimeDays: { type: Number, default: 0, min: 0 },
		currentBalance: { type: Number, default: 0, min: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Supplier', supplierSchema);
