const mongoose = require('mongoose');
const portfolioSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  qty: { type: Number, required: true },
  price_of_purchase: { type: Number, required: true },
  date_of_purchase: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
