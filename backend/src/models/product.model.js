const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		sku: { type: String, required: true, trim: true },
		name: { type: String, required: true, trim: true },
		description: { type: String },
		categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
		unit: { type: String, default: 'pcs' },
		posPrice: { type: Number, required: true, min: 0 },
		ecommercePrice: { type: Number, required: true, min: 0 },
		// Ecommerce sale-specific fields
		isOnSale: { type: Boolean, default: false },
		salePrice: { type: Number, min: 0 },
		taxRate: { type: Number, default: 0, min: 0 },
		visibility: {
			type: String,
			enum: ['pos_only', 'ecommerce_only', 'both'],
			default: 'both',
		},
		isActive: { type: Boolean, default: true },
		image: { type: String, trim: true },
		images: [{ type: String, trim: true }],
	},
	{ timestamps: true },
);

productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
