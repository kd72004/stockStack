const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const auth = require('../middleware/auth')

router.post('/add',auth, watchlistController.addToWatchlist);
router.post('/show',auth, watchlistController.getUserWatchlistStocks);

router.get('/:userId',auth, watchlistController.getWatchlist);
router.delete('/remove',auth, watchlistController.removeFromWatchlist);

module.exports = router;
