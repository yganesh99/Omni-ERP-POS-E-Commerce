const fs = require('fs');
const path = require('path');
const SupplierInvoice = require('../models/supplierInvoice.model');
const PurchaseOrder = require('../models/purchaseOrder.model');

/**
 * Create a supplier invoice (validates pricing matches PO).
 */
async function create(businessId, data) {
	const po = await PurchaseOrder.findById(data.purchaseOrderId);
	if (!po || String(po.businessId) !== String(businessId)) {
		throw Object.assign(new Error('PO not found'), { status: 404 });
	}

	// Validate prices match PO
	for (const invoiceItem of data.items) {
		const poItem = po.items.find(
			(i) => String(i.productId) === String(invoiceItem.productId),
		);
		if (!poItem) {
			throw Object.assign(
				new Error(`Product ${invoiceItem.productId} not in PO`),
				{ status: 400 },
			);
		}
		if (poItem.unitPrice !== invoiceItem.unitPrice) {
			throw Object.assign(
				new Error(
					`Price mismatch for ${poItem.sku}: PO=${poItem.unitPrice}, Invoice=${invoiceItem.unitPrice}`,
				),
				{ status: 400 },
			);
		}
	}

	return SupplierInvoice.create({
		businessId,
		supplierId: data.supplierId,
		purchaseOrderId: data.purchaseOrderId,
		invoiceNumber: data.invoiceNumber,
		items: data.items,
		totalAmount: data.totalAmount,
	});
}

async function getByBusiness(
	businessId,
	{ supplierId, status, page = 1, limit = 50 } = {},
) {
	const query = { businessId };
	if (supplierId) query.supplierId = supplierId;
	if (status) query.status = status;

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		SupplierInvoice.find(query)
			.populate('supplierId', 'name')
			.populate('purchaseOrderId', 'poNumber')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		SupplierInvoice.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return SupplierInvoice.findById(id)
		.populate('supplierId', 'name contactPerson')
		.populate('purchaseOrderId', 'poNumber');
}

/**
 * Record payment against a supplier invoice.
 */
async function recordPayment(id, amount) {
	const invoice = await SupplierInvoice.findById(id);
	if (!invoice)
		throw Object.assign(new Error('Invoice not found'), { status: 404 });

	invoice.paidAmount += amount;
	if (invoice.paidAmount >= invoice.totalAmount) {
		invoice.status = 'paid';
	} else {
		invoice.status = 'partial_paid';
	}
	return invoice.save();
}

/**
 * Add attachments to a supplier invoice.
 */
async function addAttachments(id, files) {
	const invoice = await SupplierInvoice.findById(id);
	if (!invoice)
		throw Object.assign(new Error('Invoice not found'), { status: 404 });

	const newAttachments = files.map((file) => ({
		filename: file.filename,
		originalName: file.originalname,
		mimeType: file.mimetype,
		size: file.size,
		path: file.path,
	}));

	invoice.attachments.push(...newAttachments);
	return invoice.save();
}

/**
 * Remove an attachment from a supplier invoice.
 */
async function removeAttachment(id, filename) {
	const invoice = await SupplierInvoice.findById(id);
	if (!invoice)
		throw Object.assign(new Error('Invoice not found'), { status: 404 });

	const attachmentIndex = invoice.attachments.findIndex(
		(att) => att.filename === filename,
	);

	if (attachmentIndex === -1) {
		throw Object.assign(new Error('Attachment not found'), { status: 404 });
	}

	const [attachment] = invoice.attachments.splice(attachmentIndex, 1);
	await invoice.save();

	// Delete file from disk
	try {
		fs.unlinkSync(attachment.path);
	} catch (err) {
		console.error(`Failed to delete file ${attachment.path}:`, err.message);
	}

	return invoice;
}

module.exports = {
	create,
	getByBusiness,
	getById,
	recordPayment,
	addAttachments,
	removeAttachment,
};
