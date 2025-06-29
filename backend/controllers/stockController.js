const Stock = require('../models/stock');
const Watchlist = require('../models/watchlist');

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();  
    res.json(stocks); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};


exports.getStockById = async (req, res) => {
  try {
    const { stockId } = req.params;

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock info' });
  }
};

// controllers/watchlist.js


exports.getstockname = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({ stock_name: stock.stock_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock info' });
  }
};