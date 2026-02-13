const mongoose = require('mongoose');

const poItemSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		sku: { type: String, required: true },
		name: { type: String, required: true },
		orderedQty: { type: Number, required: true, min: 1 },
		receivedQty: { type: Number, default: 0, min: 0 },
		unitPrice: { type: Number, required: true, min: 0 },
		lineTotal: { type: Number, required: true, min: 0 },
	},
	{ _id: false },
);

const purchaseOrderSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		supplierId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Supplier',
			required: true,
		},
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			required: true,
		},
		poNumber: { type: String, required: true },
		status: {
			type: String,
			enum: [
				'draft',
				'approved',
				'sent',
				'partial_received',
				'closed',
				'cancelled',
			],
			default: 'draft',
		},
		items: { type: [poItemSchema], required: true },
		totalAmount: { type: Number, required: true, min: 0 },
		notes: { type: String },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		approvedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
	},
	{ timestamps: true },
);

purchaseOrderSchema.index({ businessId: 1, poNumber: 1 }, { unique: true });
purchaseOrderSchema.index({ businessId: 1, supplierId: 1 });
purchaseOrderSchema.index({ businessId: 1, status: 1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
