const mongoose = require('mongoose');

const returnItemSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		quantity: { type: Number, required: true, min: 1 },
		unitPrice: { type: Number, required: true, min: 0 },
		lineTotal: { type: Number, required: true, min: 0 },
	},
	{ _id: false },
);

const returnSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		type: {
			type: String,
			enum: ['customer', 'supplier'],
			required: true,
		},
		entityId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Order',
			default: null,
		},
		purchaseOrderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PurchaseOrder',
			default: null,
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			required: true,
		},
		items: { type: [returnItemSchema], required: true },
		totalAmount: { type: Number, required: true, min: 0 },
		reason: { type: String },
		status: {
			type: String,
			enum: ['pending', 'approved', 'completed'],
			default: 'pending',
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
);

returnSchema.index({ businessId: 1, type: 1 });
returnSchema.index({ businessId: 1, orderId: 1 });

module.exports = mongoose.model('Return', returnSchema);
