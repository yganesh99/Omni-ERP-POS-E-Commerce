const taxService = require('../services/tax.service');

exports.create = async (req, res, next) => {
	try {
		const tax = await taxService.create({
			...req.body,
		});
		res.status(201).json(tax);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const list = await taxService.getAll();
		res.json(list);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const tax = await taxService.getById(req.params.id);
		if (!tax) return res.status(404).json({ message: 'Not found' });
		res.json(tax);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const tax = await taxService.update(req.params.id, req.body);
		if (!tax) return res.status(404).json({ message: 'Not found' });
		res.json(tax);
	} catch (err) {
		next(err);
	}
};
