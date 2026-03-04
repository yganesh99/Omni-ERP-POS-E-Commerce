const Product = require('../models/product.model');

async function create(data) {
	return Product.create(data);
}

async function getAll({
	visibility,
	category,
	search,
	name,
	sku,
	page = 1,
	limit = 50,
} = {}) {
	const query = { isActive: true };
	if (visibility) query.visibility = visibility;
	if (category) query.category = category;
	if (name) query.name = { $regex: name, $options: 'i' };
	if (sku) query.sku = { $regex: sku, $options: 'i' };

	if (search) {
		query.$or = [
			{ name: { $regex: search, $options: 'i' } },
			{ sku: { $regex: search, $options: 'i' } },
		];
	}

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Product.find(query).sort({ name: 1 }).skip(skip).limit(limit),
		Product.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return Product.findById(id);
}

async function getBySku(sku) {
	return Product.findOne({ sku });
}

async function update(id, data) {
	return Product.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});
}

async function toggleActive(id) {
	const product = await Product.findById(id);
	if (!product) return null;
	product.isActive = !product.isActive;
	return product.save();
}

module.exports = {
	create,
	getAll,
	getById,
	getBySku,
	update,
	toggleActive,
};
