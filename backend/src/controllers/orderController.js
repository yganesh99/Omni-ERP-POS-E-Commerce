const orderService = require('../services/order.service');

exports.getAll = async (req, res, next) => {
	try {
		const result = await orderService.getByBusiness(
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
		const order = await orderService.getById(req.params.id);
		if (!order) return res.status(404).json({ message: 'Not found' });
		res.json(order);
	} catch (err) {
		next(err);
	}
};

exports.updateStatus = async (req, res, next) => {
	try {
		const order = await orderService.updateStatus(
			req.params.id,
			req.body.status,
		);
		if (!order) return res.status(404).json({ message: 'Not found' });
		res.json(order);
	} catch (err) {
		next(err);
	}
};
