const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// GET /transactions/:userId
router.get('/:userId', transactionController.getTransactionsByUser);

module.exports = router;
