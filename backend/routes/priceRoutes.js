const express = require('express');
const router = express.Router();
const priceHistoryController = require('../controllers/priceController');

// GET all price history
router.get('/', priceHistoryController.getAllPriceHistory);

// GET price history by stock_id
router.get('/:stock_id', priceHistoryController.getHistoryByStockId);

module.exports = router;
