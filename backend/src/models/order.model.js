const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		sku: { type: String, required: true },
		name: { type: String, required: true },
		quantity: { type: Number, required: true, min: 0 },
		unit: { type: String, default: 'pcs' },
		unitPrice: { type: Number, required: true, min: 0 },
		taxRate: { type: Number, default: 0, min: 0 },
		taxAmount: { type: Number, default: 0, min: 0 },
		lineTotal: { type: Number, required: true, min: 0 },
	},
	{ _id: false },
);

const paymentDetailSchema = new mongoose.Schema(
	{
		method: {
			type: String,
			enum: ['cash', 'card', 'qr', 'credit'],
			required: true,
		},
		amount: { type: Number, required: true, min: 0 },
		reference: { type: String },
	},
	{ _id: false },
);

const orderSchema = new mongoose.Schema(
	{
		storeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			required: true,
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			default: null,
		},
		orderNumber: { type: String, required: true },
		channel: {
			type: String,
			enum: ['pos', 'ecommerce'],
			required: true,
		},
		status: {
			type: String,
			enum: [
				'pending',
				'confirmed',
				'processing',
				'shipped',
				'delivered',
				'cancelled',
				'returned', // legacy; use refunded for full refund
				'partially_returned', // some items returned, more returns allowed
				'refunded', // whole order refunded
			],
			default: 'pending',
		},
		items: { type: [orderItemSchema], required: true },
		subtotal: { type: Number, required: true, min: 0 },
		taxAmount: { type: Number, default: 0, min: 0 },
		totalAmount: { type: Number, required: true, min: 0 },
		paymentMethod: {
			type: String,
			enum: ['cash', 'card', 'qr', 'split', 'credit'],
			required: true,
		},
		payments: { type: [paymentDetailSchema], default: [] },
		creditUsed: { type: Number, default: 0, min: 0 },
		discountType: {
			type: String,
			enum: ['percentage', 'fixed', null],
			default: null,
		},
		discountValue: { type: Number, default: 0, min: 0 },
		discountAmount: { type: Number, default: 0, min: 0 },
		notes: { type: String },
		fulfilledBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Store',
			default: null,
		},
		sessionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'RegisterSession',
			default: null,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ channel: 1, status: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
