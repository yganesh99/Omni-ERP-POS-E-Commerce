const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
			index: true,
		},
		name: { type: String, required: true, trim: true },
		code: { type: String, required: true, trim: true },
		address: {
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
		phone: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

storeSchema.index({ businessId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Store', storeSchema);
