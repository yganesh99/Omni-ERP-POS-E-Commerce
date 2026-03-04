const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const auth = require('../middlewares/auth');

router.post('/', auth(['admin']), registerController.createRegister);
router.get('/', auth(['admin', 'cashier']), registerController.getRegisters);

router.post(
	'/:id/open',
	auth(['admin', 'cashier']),
	registerController.openSession,
);
router.get(
	'/:id/sessions/current',
	auth(['admin', 'cashier']),
	registerController.getCurrentSession,
);
router.post(
	'/sessions/:sessionId/close',
	auth(['admin', 'cashier']),
	registerController.closeSession,
);

module.exports = router;
