const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
			required: true,
		},
		entityType: {
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
		supplierInvoiceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SupplierInvoice',
			default: null,
		},
		amount: { type: Number, required: true, min: 0 },
		method: {
			type: String,
			enum: ['cash', 'card', 'qr', 'bank_transfer', 'other'],
			required: true,
		},
		reference: { type: String },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true },
);

paymentSchema.index({ businessId: 1, entityType: 1, entityId: 1 });
paymentSchema.index({ businessId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
