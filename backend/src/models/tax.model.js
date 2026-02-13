const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
			index: true,
		},
		name: { type: String, required: true, trim: true },
		rate: { type: Number, required: true, min: 0 },
		isDefault: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

taxSchema.index({ businessId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Tax', taxSchema);
