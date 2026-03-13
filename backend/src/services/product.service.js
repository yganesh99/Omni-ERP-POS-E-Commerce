const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');

async function create(data) {
	return Product.create(data);
}

/**
 * Search products visible in POS and include stock for a given store.
 */
async function searchForPos({
	search,
	category,
	storeId,
	page = 1,
	limit = 50,
} = {}) {
	const query = { isActive: true, visibility: { $in: ['both', 'pos_only'] } };

	if (search) {
		query.$or = [
			{ name: { $regex: search, $options: 'i' } },
			{ sku: { $regex: search, $options: 'i' } },
		];
	}
	if (category) {
		query.categories = category;
	}

	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		Product.find(query)
			.populate('categories', 'name')
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		Product.countDocuments(query),
	]);

	// Attach stock info for the given store
	if (storeId && items.length > 0) {
		const productIds = items.map((p) => p._id);
		const inventoryRecords = await Inventory.find({
			productId: { $in: productIds },
			storeId,
		}).lean();

		const stockMap = {};
		for (const inv of inventoryRecords) {
			stockMap[String(inv.productId)] =
				inv.quantity - (inv.reservedQuantity || 0);
		}

		for (const item of items) {
			item.stock = stockMap[String(item._id)] ?? 0;
		}
	}

	return { items, total, page, limit };
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
	if (category) query.categories = category;
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
		Product.find(query)
			.populate('categories', 'name')
			.sort({ name: 1 })
			.skip(skip)
			.limit(limit),
		Product.countDocuments(query),
	]);
	return { items, total, page, limit };
}

async function getById(id) {
	return Product.findById(id).populate('categories', 'name');
}

async function getBySku(sku) {
	return Product.findOne({ sku }).populate('categories', 'name');
}

async function update(id, data) {
	return Product.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	}).populate('categories', 'name');
}

async function toggleActive(id) {
	const product = await Product.findById(id);
	if (!product) return null;
	product.isActive = !product.isActive;
	return product.save();
}

module.exports = {
	create,
	searchForPos,
	getAll,
	getById,
	getBySku,
	update,
	toggleActive,
};
