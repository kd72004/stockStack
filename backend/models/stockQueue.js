    const mongoose = require('mongoose');
    const stockQueueSchema = new mongoose.Schema({
    stockId: { type: Number, unique: true },

    buyOrders: [
        {
        orderId: Number,
        price: mongoose.Types.Decimal128,
        quantity: Number,
        timestamp: { type: Date, default: Date.now }
        }
    ],

    sellOrders: [
        {
        orderId: Number,
        price: mongoose.Types.Decimal128,
        quantity: Number,
        timestamp: { type: Date, default: Date.now }
        }
    ]
    });

    module.exports = mongoose.model('StockQueue', stockQueueSchema);
