const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');
const Customer = require('../models/customer.model');
const Supplier = require('../models/supplier.model');
const PurchaseOrder = require('../models/purchaseOrder.model');
const Product = require('../models/product.model');

/**
 * Sales by store.
 */
async function salesByStore(businessId, { startDate, endDate } = {}) {
	const match = {
		businessId: require('mongoose').Types.ObjectId(businessId),
		status: { $nin: ['cancelled', 'returned'] },
	};
	if (startDate || endDate) {
		match.createdAt = {};
		if (startDate) match.createdAt.$gte = new Date(startDate);
		if (endDate) match.createdAt.$lte = new Date(endDate);
	}

	return Order.aggregate([
		{ $match: match },
		{
			$group: {
				_id: '$storeId',
				totalSales: { $sum: '$totalAmount' },
				totalOrders: { $sum: 1 },
				avgOrderValue: { $avg: '$totalAmount' },
			},
		},
		{
			$lookup: {
				from: 'stores',
				localField: '_id',
				foreignField: '_id',
				as: 'store',
			},
		},
		{ $unwind: '$store' },
		{ $sort: { totalSales: -1 } },
	]);
}

/**
 * Sales by product.
 */
async function salesByProduct(businessId, { startDate, endDate } = {}) {
	const match = {
		businessId: require('mongoose').Types.ObjectId(businessId),
		status: { $nin: ['cancelled', 'returned'] },
	};
	if (startDate || endDate) {
		match.createdAt = {};
		if (startDate) match.createdAt.$gte = new Date(startDate);
		if (endDate) match.createdAt.$lte = new Date(endDate);
	}

	return Order.aggregate([
		{ $match: match },
		{ $unwind: '$items' },
		{
			$group: {
				_id: '$items.productId',
				sku: { $first: '$items.sku' },
				name: { $first: '$items.name' },
				totalQuantity: { $sum: '$items.quantity' },
				totalRevenue: { $sum: '$items.lineTotal' },
			},
		},
		{ $sort: { totalRevenue: -1 } },
	]);
}

/**
 * Sales by cashier.
 */
async function salesByCashier(businessId, { startDate, endDate } = {}) {
	const match = {
		businessId: require('mongoose').Types.ObjectId(businessId),
		channel: 'pos',
		status: { $nin: ['cancelled', 'returned'] },
	};
	if (startDate || endDate) {
		match.createdAt = {};
		if (startDate) match.createdAt.$gte = new Date(startDate);
		if (endDate) match.createdAt.$lte = new Date(endDate);
	}

	return Order.aggregate([
		{ $match: match },
		{
			$group: {
				_id: '$createdBy',
				totalSales: { $sum: '$totalAmount' },
				totalOrders: { $sum: 1 },
			},
		},
		{
			$lookup: {
				from: 'users',
				localField: '_id',
				foreignField: '_id',
				as: 'cashier',
			},
		},
		{ $unwind: '$cashier' },
		{
			$project: {
				cashierName: '$cashier.name',
				totalSales: 1,
				totalOrders: 1,
			},
		},
		{ $sort: { totalSales: -1 } },
	]);
}

/**
 * Low stock alerts.
 */
async function lowStock(businessId, threshold = 10) {
	return Inventory.find({
		businessId,
		$expr: {
			$lte: [
				{ $subtract: ['$quantity', '$reservedQuantity'] },
				threshold,
			],
		},
	})
		.populate('productId', 'name sku')
		.populate('storeId', 'name code');
}

/**
 * Inventory valuation.
 */
async function inventoryValuation(businessId) {
	return Inventory.aggregate([
		{
			$match: {
				businessId: require('mongoose').Types.ObjectId(businessId),
			},
		},
		{
			$lookup: {
				from: 'products',
				localField: 'productId',
				foreignField: '_id',
				as: 'product',
			},
		},
		{ $unwind: '$product' },
		{
			$group: {
				_id: null,
				totalUnits: { $sum: '$quantity' },
				totalCostValue: {
					$sum: { $multiply: ['$quantity', '$product.costPrice'] },
				},
				totalRetailValue: {
					$sum: { $multiply: ['$quantity', '$product.posPrice'] },
				},
			},
		},
	]);
}

/**
 * Customer credit exposure.
 */
async function customerCreditExposure(businessId) {
	return Customer.find({ businessId, currentBalance: { $gt: 0 } })
		.select('name email phone creditLimit currentBalance')
		.sort({ currentBalance: -1 });
}

/**
 * Supplier payables summary.
 */
async function supplierPayables(businessId) {
	return Supplier.find({ businessId, currentBalance: { $gt: 0 } })
		.select('name contactPerson email currentBalance')
		.sort({ currentBalance: -1 });
}

/**
 * Profit per SKU.
 */
async function profitPerSku(businessId, { startDate, endDate } = {}) {
	const match = {
		businessId: require('mongoose').Types.ObjectId(businessId),
		status: { $nin: ['cancelled', 'returned'] },
	};
	if (startDate || endDate) {
		match.createdAt = {};
		if (startDate) match.createdAt.$gte = new Date(startDate);
		if (endDate) match.createdAt.$lte = new Date(endDate);
	}

	return Order.aggregate([
		{ $match: match },
		{ $unwind: '$items' },
		{
			$lookup: {
				from: 'products',
				localField: 'items.productId',
				foreignField: '_id',
				as: 'product',
			},
		},
		{ $unwind: '$product' },
		{
			$group: {
				_id: '$items.productId',
				sku: { $first: '$items.sku' },
				name: { $first: '$items.name' },
				totalRevenue: { $sum: '$items.lineTotal' },
				totalCost: {
					$sum: {
						$multiply: ['$items.quantity', '$product.costPrice'],
					},
				},
				totalQuantity: { $sum: '$items.quantity' },
			},
		},
		{
			$addFields: {
				profit: { $subtract: ['$totalRevenue', '$totalCost'] },
				margin: {
					$cond: [
						{ $eq: ['$totalRevenue', 0] },
						0,
						{
							$multiply: [
								{
									$divide: [
										{
											$subtract: [
												'$totalRevenue',
												'$totalCost',
											],
										},
										'$totalRevenue',
									],
								},
								100,
							],
						},
					],
				},
			},
		},
		{ $sort: { profit: -1 } },
	]);
}

module.exports = {
	salesByStore,
	salesByProduct,
	salesByCashier,
	lowStock,
	inventoryValuation,
	customerCreditExposure,
	supplierPayables,
	profitPerSku,
};
