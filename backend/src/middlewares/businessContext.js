const Business = require('../models/business.model');

/**
 * Extracts businessId from route params or header and attaches to req.businessId.
 * Validates the business exists and is active.
 */
module.exports = async (req, res, next) => {
	try {
		const businessId =
			req.params.businessId || req.headers['x-business-id'];

		if (!businessId) {
			return res.status(400).json({ message: 'Business ID is required' });
		}

		const business = await Business.findById(businessId);
		if (!business) {
			return res.status(404).json({ message: 'Business not found' });
		}
		if (!business.isActive) {
			return res.status(403).json({ message: 'Business is deactivated' });
		}

		req.businessId = business._id;
		req.business = business;
		next();
	} catch (err) {
		next(err);
	}
};
