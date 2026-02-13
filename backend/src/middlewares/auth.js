const tokenService = require('../services/token.service');

/**
 * Auth middleware – verifies JWT, attaches user context,
 * and enforces role-based access control.
 * @param {string[]} requiredRoles – allowed roles (empty = any authenticated user)
 */
module.exports =
	(requiredRoles = []) =>
	(req, res, next) => {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith('Bearer '))
			return res.status(401).json({ message: 'Unauthorized' });
		const token = auth.split(' ')[1];
		try {
			const payload = tokenService.verifyAccessToken(token);
			req.user = {
				id: payload.sub,
				role: payload.role || null,
				businessId: payload.businessId || null,
				storeId: payload.storeId || null,
			};
			if (
				requiredRoles.length &&
				!requiredRoles.includes(req.user.role)
			) {
				return res.status(403).json({ message: 'Forbidden' });
			}

			// Tenant isolation: non-super-admin must match business context
			if (req.user.role !== 'super_admin') {
				const requestedBusiness =
					req.params.businessId || req.headers['x-business-id'];
				if (
					requestedBusiness &&
					req.user.businessId &&
					requestedBusiness !== String(req.user.businessId)
				) {
					return res
						.status(403)
						.json({ message: 'Cross-business access denied' });
				}
			}

			next();
		} catch (err) {
			return res.status(401).json({ message: 'Invalid token' });
		}
	};
