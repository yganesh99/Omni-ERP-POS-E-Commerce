const Order = require('../models/order.model');
const Inventory = require('../models/inventory.model');
const Customer = require('../models/customer.model');
const Supplier = require('../models/supplier.model');
const PurchaseOrder = require('../models/purchaseOrder.model');
const Product = require('../models/product.model');

/**
 * Sales by store.
 */
async function salesByStore({ startDate, endDate } = {}) {
	const match = {
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
async function salesByProduct({ startDate, endDate } = {}) {
	const match = {
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
async function salesByCashier({ startDate, endDate } = {}) {
	const match = {
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
async function lowStock(threshold = 10) {
	return Inventory.find({
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
async function inventoryValuation() {
	return Inventory.aggregate([
		{
			$match: {},
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
				totalValue: {
					$sum: { $multiply: ['$quantity', '$product.posPrice'] },
				},
			},
		},
	]);
}

/**
 * Customer credit exposure.
 */
async function customerCreditExposure() {
	return Customer.find({ currentBalance: { $gt: 0 } })
		.select('name email phone creditLimit currentBalance')
		.sort({ currentBalance: -1 });
}

/**
 * Supplier payables summary.
 */
async function supplierPayables() {
	return Supplier.find({ currentBalance: { $gt: 0 } })
		.select('name contactPerson email currentBalance')
		.sort({ currentBalance: -1 });
}

/**
 * Profit per SKU.
 */
async function profitPerSku({ startDate, endDate } = {}) {
	const match = {
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
				totalCost: { $sum: 0 },
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
