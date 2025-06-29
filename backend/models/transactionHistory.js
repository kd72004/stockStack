    const mongoose = require('mongoose');
    const transactionHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    price: { type: Number, required: true },
    buy_or_sell: { type: String, enum: ['buy', 'sell'], required: true },
    qty: { type: Number, required: true },
    date: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('TransactionHistory', transactionHistorySchema);
