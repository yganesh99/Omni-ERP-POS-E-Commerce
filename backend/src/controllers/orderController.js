const orderService = require('../services/order.service');
const { generateInvoice } = require('../utils/pdfGenerator');

exports.getAll = async (req, res, next) => {
	try {
		const result = await orderService.getAll(req.query);
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

exports.generateInvoice = async (req, res, next) => {
	try {
		const order = await orderService.getById(req.params.id);

		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// Optional: Ensure the order is in a state that enables it to have an invoice (like confirmed/shipped)
		if (order.status === 'pending' || order.status === 'cancelled') {
			return res
				.status(400)
				.json({
					message: `Cannot generate invoice for a ${order.status} order`,
				});
		}

		// Set response headers to force PDF download/inline viewing in browser
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			`inline; filename=invoice-${order.orderNumber}.pdf`,
		);

		// Generate and pipe the PDF
		generateInvoice(order, res);

		// Note: We don't call res.json() here since the stream automatically handles closing the response
	} catch (err) {
		next(err);
	}
};
