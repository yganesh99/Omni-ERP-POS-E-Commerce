const inventoryService = require('../services/inventory.service');

exports.getStock = async (req, res, next) => {
	try {
		const stock = await inventoryService.getStock(
			req.query.businessId || req.businessId,
			{
				storeId: req.query.storeId,
				productId: req.query.productId,
			},
		);
		res.json(stock);
	} catch (err) {
		next(err);
	}
};

exports.adjust = async (req, res, next) => {
	try {
		const { productId, storeId, quantityChange } = req.body;
		const inv = await inventoryService.adjustStock(
			req.businessId || req.body.businessId,
			productId,
			storeId,
			quantityChange,
			req.user.id,
		);
		res.json(inv);
	} catch (err) {
		next(err);
	}
};

exports.transfer = async (req, res, next) => {
	try {
		const { fromStoreId, toStoreId, items } = req.body;
		const transfer = await inventoryService.transferStock(
			req.businessId || req.body.businessId,
			fromStoreId,
			toStoreId,
			items,
			req.user.id,
		);
		res.status(201).json(transfer);
	} catch (err) {
		next(err);
	}
};

exports.lock = async (req, res, next) => {
	try {
		const { storeId, items, sessionId, ttlMinutes } = req.body;
		const locks = await inventoryService.lockStock(
			req.businessId || req.body.businessId,
			storeId,
			items,
			sessionId,
			ttlMinutes,
		);
		res.status(201).json(locks);
	} catch (err) {
		next(err);
	}
};

exports.release = async (req, res, next) => {
	try {
		const { sessionId } = req.body;
		const result = await inventoryService.releaseStock(sessionId);
		res.json({ released: result.length });
	} catch (err) {
		next(err);
	}
};
