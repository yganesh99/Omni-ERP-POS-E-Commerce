const businessService = require('../services/business.service');

exports.create = async (req, res, next) => {
	try {
		const biz = await businessService.create(req.body);
		res.status(201).json(biz);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const list = await businessService.getAll();
		res.json(list);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const biz = await businessService.getById(req.params.id);
		if (!biz) return res.status(404).json({ message: 'Not found' });
		res.json(biz);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const biz = await businessService.update(req.params.id, req.body);
		if (!biz) return res.status(404).json({ message: 'Not found' });
		res.json(biz);
	} catch (err) {
		next(err);
	}
};

exports.toggleActive = async (req, res, next) => {
	try {
		const biz = await businessService.toggleActive(req.params.id);
		if (!biz) return res.status(404).json({ message: 'Not found' });
		res.json(biz);
	} catch (err) {
		next(err);
	}
};
