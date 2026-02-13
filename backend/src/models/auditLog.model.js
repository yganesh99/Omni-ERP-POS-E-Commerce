const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
	{
		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Business',
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		action: { type: String, required: true },
		entity: { type: String, required: true },
		entityId: { type: mongoose.Schema.Types.ObjectId },
		changes: { type: mongoose.Schema.Types.Mixed },
		ipAddress: { type: String },
	},
	{ timestamps: true },
);

auditLogSchema.index({ businessId: 1, entity: 1, entityId: 1 });
auditLogSchema.index({ businessId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
