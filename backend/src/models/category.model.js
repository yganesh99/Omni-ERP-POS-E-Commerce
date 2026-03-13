const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true, trim: true },
		description: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

// Index for text search
categorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', categorySchema);
