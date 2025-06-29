const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/show', stockController.getAllStocks);  // GET /stocks
router.get('/:stockId', stockController.getStockById);
router.get('/individual/:id',stockController.getstockname);

// router.post('/show', stockController.getUserWatchlistStocks);  // GET /stocks

module.exports = router;
