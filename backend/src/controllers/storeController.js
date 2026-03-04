const storeService = require('../services/store.service');

exports.create = async (req, res, next) => {
	try {
		const store = await storeService.create({
			...req.body,
		});
		res.status(201).json(store);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const list = await storeService.getAll();
		res.json(list);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const store = await storeService.getById(req.params.id);
		if (!store) return res.status(404).json({ message: 'Not found' });
		res.json(store);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const store = await storeService.update(req.params.id, req.body);
		if (!store) return res.status(404).json({ message: 'Not found' });
		res.json(store);
	} catch (err) {
		next(err);
	}
};

exports.toggleActive = async (req, res, next) => {
	try {
		const store = await storeService.toggleActive(req.params.id);
		if (!store) return res.status(404).json({ message: 'Not found' });
		res.json(store);
	} catch (err) {
		next(err);
	}
};
