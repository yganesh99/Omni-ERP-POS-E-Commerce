const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
			index: true,
		},
		sku: { type: String, required: true, trim: true },
		name: { type: String, required: true, trim: true },
		description: { type: String },
		category: { type: String, trim: true },
		unit: { type: String, default: 'pcs' },
		posPrice: { type: Number, required: true, min: 0 },
		ecommercePrice: { type: Number, required: true, min: 0 },
		costPrice: { type: Number, required: true, min: 0 },
		taxRate: { type: Number, default: 0, min: 0 },
		visibility: {
			type: String,
			enum: ['pos_only', 'ecommerce_only', 'both'],
			default: 'both',
		},
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

productSchema.index({ businessId: 1, sku: 1 }, { unique: true });
productSchema.index({ businessId: 1, name: 'text' });

module.exports = mongoose.model('Product', productSchema);
