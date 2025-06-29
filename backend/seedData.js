const mongoose = require('mongoose');
require('dotenv').config();

// ✅ Load Models
const PriceHistory = require('./models/priceHistory');
const Portfolio = require('./models/portfolio');

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  seedData();
}).catch(err => console.error('❌ MongoDB connection error:', err));

async function seedData() {
  const stockId = new mongoose.Types.ObjectId("685ccf6bf084d307031288f7");
  const userId = new mongoose.Types.ObjectId("685944b0c760d263682d2ed0");

  // 🟢 Insert 5 price history entries
  const priceHistoryEntries = [
    { stock_id: stockId, price: 172, timestamp: new Date('2025-06-21T12:00:00Z') },
    { stock_id: stockId, price: 174, timestamp: new Date('2025-06-22T12:00:00Z') },
    { stock_id: stockId, price: 173, timestamp: new Date('2025-06-23T12:00:00Z') },
    { stock_id: stockId, price: 176, timestamp: new Date('2025-06-24T12:00:00Z') },
    { stock_id: stockId, price: 175, timestamp: new Date('2025-06-25T12:00:00Z') },
  ];

  try {
    await PriceHistory.insertMany(priceHistoryEntries);
    console.log('✅ Price history inserted');

    // 🟢 Insert portfolio entry
    const portfolio = new Portfolio({
      user_id: userId,
      stock_id: stockId,
      qty: 10,
      price_of_purchase: 175,
      date_of_purchase: new Date('2025-06-26T12:00:00Z')
    });

    await portfolio.save();
    console.log('✅ Portfolio entry inserted');
  } catch (error) {
    console.error('❌ Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}
