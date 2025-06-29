const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
