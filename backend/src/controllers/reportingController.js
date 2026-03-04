const reportingService = require('../services/reporting.service');
const auditLogService = require('../services/auditLog.service');

exports.salesByStore = async (req, res, next) => {
	try {
		const data = await reportingService.salesByStore(
			req.query,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.salesByProduct = async (req, res, next) => {
	try {
		const data = await reportingService.salesByProduct(
			req.query,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.salesByCashier = async (req, res, next) => {
	try {
		const data = await reportingService.salesByCashier(
			req.query,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.lowStock = async (req, res, next) => {
	try {
		const data = await reportingService.lowStock(
			req.
			parseInt(req.query.threshold) || 10,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.inventoryValuation = async (req, res, next) => {
	try {
		const data = await reportingService.inventoryValuation();
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.creditExposure = async (req, res, next) => {
	try {
		const data = await reportingService.customerCreditExposure(
			);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.supplierPayables = async (req, res, next) => {
	try {
		const data = await reportingService.supplierPayables();
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.profitPerSku = async (req, res, next) => {
	try {
		const data = await reportingService.profitPerSku(
			req.query,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};

exports.auditLogs = async (req, res, next) => {
	try {
		const data = await auditLogService.getAll(
			req.query,
		);
		res.json(data);
	} catch (err) {
		next(err);
	}
};
