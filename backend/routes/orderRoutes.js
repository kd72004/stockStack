const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth')

router.post('/place',auth, orderController.placeOrder);

module.exports = router;
