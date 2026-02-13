const supplierInvoiceService = require('../services/supplierInvoice.service');

exports.create = async (req, res, next) => {
	try {
		const invoice = await supplierInvoiceService.create(
			req.businessId,
			req.body,
		);
		res.status(201).json(invoice);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const result = await supplierInvoiceService.getByBusiness(
			req.businessId,
			req.query,
		);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const invoice = await supplierInvoiceService.getById(req.params.id);
		if (!invoice) return res.status(404).json({ message: 'Not found' });
		res.json(invoice);
	} catch (err) {
		next(err);
	}
};

exports.recordPayment = async (req, res, next) => {
	try {
		const invoice = await supplierInvoiceService.recordPayment(
			req.params.id,
			req.body.amount,
		);
		res.json(invoice);
	} catch (err) {
		next(err);
	}
};

exports.uploadAttachments = async (req, res, next) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ message: 'No files uploaded' });
		}
		const invoice = await supplierInvoiceService.addAttachments(
			req.params.id,
			req.files,
		);
		res.json(invoice);
	} catch (err) {
		next(err);
	}
};

exports.removeAttachment = async (req, res, next) => {
	try {
		const invoice = await supplierInvoiceService.removeAttachment(
			req.params.id,
			req.params.filename,
		);
		res.json(invoice);
	} catch (err) {
		next(err);
	}
};
