const PriceHistory = require('../models/priceHistory');

exports.getAllPriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.find().populate('stock_id', 'stock_name company_name');
    res.status(200).json(history);
  } catch (err) {
    console.error('Error fetching price history:', err);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
};

exports.getHistoryByStockId = async (req, res) => {
  try {
    const { stock_id } = req.params;
    const history = await PriceHistory.find({ stock_id }).sort({ timestamp: -1 });

    if (!history.length) return res.status(404).json({ error: 'No history for this stock' });

    res.status(200).json(history);
  } catch (err) {
    console.error('Error fetching stock history:', err);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
};
