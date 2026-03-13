const productService = require('../services/product.service');
const { logAudit } = require('../middlewares/auditLog');

exports.create = async (req, res, next) => {
	try {
		const product = await productService.create({
			...req.body,
		});
		logAudit({
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
		const result = await productService.getAll(req.query);
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

exports.searchForPos = async (req, res, next) => {
	try {
		const result = await productService.searchForPos(req.query);
		res.json(result);
	} catch (err) {
		next(err);
	}
};

exports.uploadImage = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No image file provided' });
		}

		const imageUrl = `/uploads/products/${req.file.filename}`;

		const product = await productService.getById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'Not found' });
		}

		product.image = imageUrl;
		const existingImages = Array.isArray(product.images)
			? product.images
			: [];
		product.images = [...existingImages, imageUrl];

		await product.save();

		const plainProduct = product.toObject();

		logAudit({
			userId: req.user.id,
			action: 'update_image',
			entity: 'Product',
			entityId: product._id,
			changes: { image: imageUrl },
		});

		res.json(plainProduct);
	} catch (err) {
		next(err);
	}
};
