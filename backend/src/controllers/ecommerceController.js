'use strict';

const ecommerceService = require('../services/ecommerce.service');

exports.checkout = async (req, res, next) => {
	try {
		const order = await ecommerceService.checkout(
			req.body.storeId,
			req.body,
			req.body.ttlMinutes,
		);
		res.status(201).json(order);
	} catch (err) {
		next(err);
	}
};

exports.confirmPayment = async (req, res, next) => {
	try {
		const order = await ecommerceService.confirmPayment(
			req.body.orderId,
			req.body,
		);
		res.json(order);
	} catch (err) {
		next(err);
	}
};

exports.assignStore = async (req, res, next) => {
	try {
		const order = await ecommerceService.assignStore(
			req.body.orderId,
			req.body.storeId,
		);
		if (!order) return res.status(404).json({ message: 'Order not found' });
		res.json(order);
	} catch (err) {
		next(err);
	}
};

exports.processReturn = async (req, res, next) => {
	try {
		const result = await ecommerceService.processReturn(
			req.body.orderId,
			req.body,
			req.user.id,
		);
		res.json(result);
	} catch (err) {
		next(err);
	}
};
