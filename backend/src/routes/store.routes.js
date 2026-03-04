const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/storeController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			code: Joi.string().required(),
			address: Joi.object({
				street: Joi.string().allow(''),
				city: Joi.string().allow(''),
				state: Joi.string().allow(''),
				zip: Joi.string().allow(''),
				country: Joi.string().allow(''),
			}).optional(),
			phone: Joi.string().allow('').optional(),
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
			name: Joi.string().allow(''),
			address: Joi.object({
				street: Joi.string().allow(''),
				city: Joi.string().allow(''),
				state: Joi.string().allow(''),
				zip: Joi.string().allow(''),
				country: Joi.string().allow(''),
			}),
			phone: Joi.string().allow(''),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
