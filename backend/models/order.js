    // const orderSchema = new mongoose.Schema({
    // orderId: { type: Number, unique: true },
    // userId: { type: Number, required: true },
    // stockId: { type: Number, required: true },
    // type: { type: String, enum: ['BUY', 'SELL'], required: true },
    // price: { type: mongoose.Types.Decimal128, required: true },
    // quantity: { type: Number, required: true },
    // remainingQuantity: { type: Number, required: true },
    // status: { type: String, enum: ['OPEN', 'PARTIAL', 'FILLED', 'CANCELLED'], required: true },
    // timestamp: { type: Date, default: Date.now }
    // });

    // module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  status: {
    type: String,
    enum: ['OPEN', 'PARTIAL', 'FILLED', 'CANCELLED'],
    default: 'OPEN',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
