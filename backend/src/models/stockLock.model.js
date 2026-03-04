const mongoose = require('mongoose');

const stockLockSchema = new mongoose.Schema(
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
		quantity: { type: Number, required: true, min: 1 },
		sessionId: { type: String, required: true, index: true },
		expiresAt: { type: Date, required: true },
		status: {
			type: String,
			enum: ['active', 'released', 'confirmed', 'expired'],
			default: 'active',
		},
	},
	{ timestamps: true },
);

// TTL index: MongoDB automatically removes docs after expiresAt
stockLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
stockLockSchema.index({ sessionId: 1 });

module.exports = mongoose.model('StockLock', stockLockSchema);
