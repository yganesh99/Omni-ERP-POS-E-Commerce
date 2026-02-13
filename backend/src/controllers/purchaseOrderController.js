const poService = require('../services/purchaseOrder.service');

exports.create = async (req, res, next) => {
	try {
		const po = await poService.create(
			req.businessId,
			req.body,
			req.user.id,
		);
		res.status(201).json(po);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const result = await poService.getByBusiness(req.businessId, req.query);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const po = await poService.getById(req.params.id);
		if (!po) return res.status(404).json({ message: 'Not found' });
		res.json(po);
	} catch (err) {
		next(err);
	}
};

exports.approve = async (req, res, next) => {
	try {
		const po = await poService.approve(req.params.id, req.user.id);
		if (!po) return res.status(404).json({ message: 'Not found' });
		res.json(po);
	} catch (err) {
		next(err);
	}
};

exports.markSent = async (req, res, next) => {
	try {
		const po = await poService.markSent(req.params.id);
		if (!po) return res.status(404).json({ message: 'Not found' });
		res.json(po);
	} catch (err) {
		next(err);
	}
};

exports.receive = async (req, res, next) => {
	try {
		const po = await poService.receiveDelivery(
			req.params.id,
			req.body.items,
			req.user.id,
		);
		res.json(po);
	} catch (err) {
		next(err);
	}
};

exports.cancel = async (req, res, next) => {
	try {
		const po = await poService.cancel(req.params.id);
		if (!po) return res.status(404).json({ message: 'Not found' });
		res.json(po);
	} catch (err) {
		next(err);
	}
};
