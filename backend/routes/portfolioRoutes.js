const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// GET all portfolios of a user
router.get('/:user_id', portfolioController.getUserPortfolio);

// UPDATE or INSERT (upsert) portfolio for a user
router.put('/', portfolioController.updatePortfolio);

// DELETE portfolio entry by ID
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;
