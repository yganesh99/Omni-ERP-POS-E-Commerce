const Category = require('../models/category.model');
const { logAudit } = require('../middlewares/auditLog');

exports.create = async (req, res, next) => {
	try {
		const category = await Category.create(req.body);
		logAudit({
			userId: req.user.id,
			action: 'create',
			entity: 'Category',
			entityId: category._id,
			changes: req.body,
		});
		res.status(201).json(category);
	} catch (err) {
		next(err);
	}
};

exports.getAll = async (req, res, next) => {
	try {
		const { search, isActive } = req.query;
		const query = {};

		if (isActive !== undefined) {
			query.isActive = isActive === 'true';
		}

		if (search) {
			query.name = { $regex: search, $options: 'i' };
		}

		const categories = await Category.find(query).sort({ name: 1 });
		res.json(categories);
	} catch (err) {
		next(err);
	}
};

exports.getById = async (req, res, next) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) return res.status(404).json({ message: 'Not found' });
		res.json(category);
	} catch (err) {
		next(err);
	}
};

exports.update = async (req, res, next) => {
	try {
		const category = await Category.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true },
		);
		if (!category) return res.status(404).json({ message: 'Not found' });
		logAudit({
			userId: req.user.id,
			action: 'update',
			entity: 'Category',
			entityId: category._id,
			changes: req.body,
		});
		res.json(category);
	} catch (err) {
		next(err);
	}
};

exports.toggleActive = async (req, res, next) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) return res.status(404).json({ message: 'Not found' });

		category.isActive = !category.isActive;
		await category.save();

		logAudit({
			userId: req.user.id,
			action: 'toggle_active',
			entity: 'Category',
			entityId: category._id,
			changes: { isActive: category.isActive },
		});
		res.json(category);
	} catch (err) {
		next(err);
	}
};
