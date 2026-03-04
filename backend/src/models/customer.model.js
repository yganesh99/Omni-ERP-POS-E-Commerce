const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, lowercase: true, trim: true },
		phone: { type: String },
		address: {
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
		creditLimit: { type: Number, default: 0, min: 0 },
		currentBalance: { type: Number, default: 0, min: 0 },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

customerSchema.virtual('availableCredit').get(function () {
	return this.creditLimit - this.currentBalance;
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

customerSchema.index({ email: 1 });

module.exports = mongoose.model('Customer', customerSchema);
