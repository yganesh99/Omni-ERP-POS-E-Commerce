'use strict';

const posService = require('../services/pos.service');
const { generateInvoice } = require('../utils/pdfGenerator');

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

exports.generateQuote = async (req, res, next) => {
	try {
		const quote = await posService.generateQuote(
			req.body.storeId,
			req.body,
			req.user.id,
		);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			`inline; filename=quote-${quote.orderNumber}.pdf`,
		);

		generateInvoice(quote, res);
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

exports.getReturnsByOrderId = async (req, res, next) => {
	try {
		const { orderId } = req.params;
		const result = await posService.getReturnsByOrderId(orderId);
		if (!result) {
			return res.status(404).json({ message: 'Order not found' });
		}
		res.json(result);
	} catch (err) {
		next(err);
	}
};
