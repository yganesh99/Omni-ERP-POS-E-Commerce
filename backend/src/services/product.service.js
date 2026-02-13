const Product = require('../models/product.model');

async function create(data) {
	return Product.create(data);
}

async function getByBusiness(
	businessId,
	{ visibility, category, search, page = 1, limit = 50 } = {},
) {
	const query = { businessId, isActive: true };
	if (visibility) query.visibility = visibility;
	if (category) query.category = category;
	if (search) query.$text = { $search: search };

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

async function getBySku(businessId, sku) {
	return Product.findOne({ businessId, sku });
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
	getByBusiness,
	getById,
	getBySku,
	update,
	toggleActive,
};
