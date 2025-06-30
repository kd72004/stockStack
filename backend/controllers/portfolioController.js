const Portfolio = require('../models/portfolio');
const Stock = require('../models/stock');

exports.getUserPortfolio = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user_id: req.params.user_id })
      .populate('stock_id');

    res.status(200).json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};


exports.updatePortfolio = async (req, res) => {
  try {
    const { user_id, stock_id, qty, price_of_purchase } = req.body;

    let portfolio = await Portfolio.findOne({ user_id, stock_id });

    if (portfolio) {
      const totalQty = portfolio.qty + qty;
      const newAvgPrice = ((portfolio.qty * portfolio.price_of_purchase) + (qty * price_of_purchase)) / totalQty;

      portfolio.qty = totalQty;
      portfolio.price_of_purchase = newAvgPrice;
      portfolio.date_of_purchase = new Date();

      await portfolio.save();
      return res.status(200).json({ message: 'Portfolio updated', portfolio });
    }

    portfolio = new Portfolio({
      user_id,
      stock_id,
      qty,
      price_of_purchase
    });

    await portfolio.save();
    res.status(201).json({ message: 'Portfolio created', portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const result = await Portfolio.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Portfolio not found' });
    res.status(200).json({ message: 'Portfolio deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
};
