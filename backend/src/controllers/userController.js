const userService = require('../services/user.service');

exports.create = async (req, res, next) => {
	try {
		const user = await userService.createUser({
			...req.body,
		});
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const list = await userService.getAll(req.query);
		res.json(list);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const user = await userService.getById(req.params.id);
		if (!user) return res.status(404).json({ message: 'Not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const user = await userService.update(req.params.id, req.body);
		if (!user) return res.status(404).json({ message: 'Not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
};

exports.toggleActive = async (req, res, next) => {
	try {
		const user = await userService.toggleActive(req.params.id);
		if (!user) return res.status(404).json({ message: 'Not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
};
