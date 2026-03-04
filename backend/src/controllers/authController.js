const User = require('../models/user.model');
const tokenService = require('../services/token.service');

exports.register = async (req, res, next) => {
	try {
		const { email, password, name, role, storeId } = req.body;
		const existing = await User.findOne({ email });
		if (existing)
			return res.status(409).json({ message: 'Email already in use' });
		const user = new User({
			email,
			password,
			name,
			role,
			storeId,
		});
		await user.save();
		res.status(201).json({
			id: user._id,
			email: user.email,
			role: user.role,
		});
	} catch (err) {
		next(err);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');
		if (!user)
			return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await user.comparePassword(password);
		if (!ok)
			return res.status(401).json({ message: 'Invalid credentials' });

		const accessToken = tokenService.signAccessToken({
			sub: user._id,
			role: user.role,
			storeId: user.storeId,
		});
		const refreshToken = tokenService.signRefreshToken({ sub: user._id });

		res.json({ accessToken, refreshToken });
	} catch (err) {
		next(err);
	}
};

exports.googleCallback = async (req, res, next) => {
	try {
		const user = req.user;
		const accessToken = tokenService.signAccessToken({
			sub: user._id,
			role: user.role,
			storeId: user.storeId,
		});
		const refreshToken = tokenService.signRefreshToken({ sub: user._id });

		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
		res.redirect(
			`${frontendUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`,
		);
	} catch (err) {
		next(err);
	}
};

exports.refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken)
			return res.status(400).send({ message: 'Missing token' });

		let payload;
		try {
			payload = tokenService.verifyRefreshToken(refreshToken);
		} catch (jwtErr) {
			return res
				.status(401)
				.json({ message: 'Invalid or expired refresh token' });
		}

		// Re-fetch user to get current role
		const user = await User.findById(payload.sub);
		if (!user) return res.status(401).json({ message: 'User not found' });

		const accessToken = tokenService.signAccessToken({
			sub: user._id,
			role: user.role,
			storeId: user.storeId,
		});
		res.json({ accessToken });
	} catch (err) {
		next(err);
	}
};

exports.me = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).populate(
			'storeId',
			'name code',
		);
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		next(err);
	}
};
