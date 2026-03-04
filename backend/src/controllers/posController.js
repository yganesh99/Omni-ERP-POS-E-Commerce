'use strict';

const posService = require('../services/pos.service');

exports.createOrder = async (req, res, next) => {
	try {
		const order = await posService.createOrder(
			req.body.storeId,
			req.body,
			req.user.id,
		);
		res.status(201).json(order);
	} catch (err) {
		next(err);
	}
};

exports.refund = async (req, res, next) => {
	try {
		const result = await posService.processRefund(
			req.body.orderId,
			req.body,
			req.user.id,
		);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
