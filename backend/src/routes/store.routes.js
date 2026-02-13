const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/storeController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(auth(['super_admin', 'business_admin']), businessContext);

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			code: Joi.string().required(),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}).optional(),
			phone: Joi.string().optional(),
		}),
	}),
	controller.create,
);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.put(
	'/:id',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string(),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}),
			phone: Joi.string(),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
