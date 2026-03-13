const express = require('express');
const controller = require('../controllers/orderController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin', 'admin', 'store_manager', 'accountant', 'cashier']));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/invoice', controller.generateInvoice);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
