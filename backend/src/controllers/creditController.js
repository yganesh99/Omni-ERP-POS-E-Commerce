const creditService = require('../services/credit.service');

exports.getCustomerLedger = async (req, res, next) => {
	try {
		const ledger = await creditService.getLedger('customer', req.params.id);
		res.json(ledger);
	} catch (err) {
		next(err);
	}
};

exports.customerPayment = async (req, res, next) => {
	try {
		const entry = await creditService.recordCustomerPayment(
			req.body.customerId,
			req.body.amount,
			req.user.id,
		);
		res.status(201).json(entry);
	} catch (err) {
		next(err);
	}
};

exports.getSupplierLedger = async (req, res, next) => {
	try {
		const ledger = await creditService.getLedger('supplier', req.params.id);
		res.json(ledger);
	} catch (err) {
		next(err);
	}
};

exports.supplierPayment = async (req, res, next) => {
	try {
		const entry = await creditService.recordSupplierPayment(
			req.body.supplierId,
			req.body.amount,
			req.user.id,
		);
		res.status(201).json(entry);
	} catch (err) {
		next(err);
	}
};
