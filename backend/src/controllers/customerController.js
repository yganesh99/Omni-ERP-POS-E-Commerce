const customerService = require('../services/customer.service');

exports.create = async (req, res, next) => {
	try {
		const cust = await customerService.create({
			...req.body,
		});
		res.status(201).json(cust);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const result = await customerService.getAll(req.query);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const cust = await customerService.getById(req.params.id);
		if (!cust) return res.status(404).json({ message: 'Not found' });
		res.json(cust);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const cust = await customerService.update(req.params.id, req.body);
		if (!cust) return res.status(404).json({ message: 'Not found' });
		res.json(cust);
	} catch (err) {
		next(err);
	}
};
