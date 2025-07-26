const mongoose = require('mongoose');
const watchlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);



