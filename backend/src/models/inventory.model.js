const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			required: true,
		},
		quantity: { type: Number, required: true, default: 0, min: 0 },
		reservedQuantity: { type: Number, default: 0, min: 0 },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

inventorySchema.virtual('availableQuantity').get(function () {
	return this.quantity - this.reservedQuantity;
});

inventorySchema.index(
	{ productId: 1, storeId: 1 },
	{ unique: true },
);
inventorySchema.index({ storeId: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
