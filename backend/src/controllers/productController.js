const productService = require('../services/product.service');
const { logAudit } = require('../middlewares/auditLog');

exports.create = async (req, res, next) => {
	try {
		const product = await productService.create({
			...req.body,
			businessId: req.businessId,
		});
		logAudit({
			businessId: req.businessId,
			userId: req.user.id,
			action: 'create',
			entity: 'Product',
			entityId: product._id,
			changes: req.body,
		});
		res.status(201).json(product);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const result = await productService.getByBusiness(
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
		const product = await productService.getById(req.params.id);
		if (!product) return res.status(404).json({ message: 'Not found' });
		res.json(product);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const product = await productService.update(req.params.id, req.body);
		if (!product) return res.status(404).json({ message: 'Not found' });
		logAudit({
			businessId: req.businessId,
			userId: req.user.id,
			action: 'update',
			entity: 'Product',
			entityId: product._id,
			changes: req.body,
		});
		res.json(product);
	} catch (err) {
		next(err);
	}
};

exports.toggleActive = async (req, res, next) => {
	try {
		const product = await productService.toggleActive(req.params.id);
		if (!product) return res.status(404).json({ message: 'Not found' });
		res.json(product);
	} catch (err) {
		next(err);
	}
};
