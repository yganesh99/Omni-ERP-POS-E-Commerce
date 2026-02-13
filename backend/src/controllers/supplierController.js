const supplierService = require('../services/supplier.service');

exports.create = async (req, res, next) => {
	try {
		const supplier = await supplierService.create({
			...req.body,
			businessId: req.businessId,
		});
		res.status(201).json(supplier);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const result = await supplierService.getByBusiness(
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
		const supplier = await supplierService.getById(req.params.id);
		if (!supplier) return res.status(404).json({ message: 'Not found' });
		res.json(supplier);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const supplier = await supplierService.update(req.params.id, req.body);
		if (!supplier) return res.status(404).json({ message: 'Not found' });
		res.json(supplier);
	} catch (err) {
		next(err);
	}
};
