const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
	{
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

storeSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model('Store', storeSchema);
