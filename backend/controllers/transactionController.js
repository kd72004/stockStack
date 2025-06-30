const TransactionHistory = require('../models/transactionHistory');
const Stock = require('../models/stock');

exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await TransactionHistory.find({ user_id: userId })
      .populate('stock_id') 
      .sort({ date: -1 });  

    const formatted = transactions.map(txn => ({
      stock_name: txn.stock_id.stock_name,
      company_name: txn.stock_id.company_name,
      price: txn.price,
      qty: txn.qty,
      type: txn.buy_or_sell,
      date: txn.date
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};
