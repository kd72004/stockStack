const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const app =express() // your express app
const server = http.createServer(app);


dotenv.config();

// const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const { setupOrderBooks } = require('./controllers/orderEngine');
const { updateCircuitsForToday } = require('./controllers/setcircuit');
const stockRoutes = require('./routes/stockRoutes');
const transectionRoutes= require('./routes/transaction');
const portfolioRoutes = require('./routes/portfolioRoutes');
const priceHistoryRoutes = require('./routes/priceRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/auth', authRoutes);
app.use('/order', orderRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/render', watchlistRoutes);
app.use('/stocks', stockRoutes);
app.use('/transection',transectionRoutes );
app.use('/portfolio', portfolioRoutes);
app.use('/price-history', priceHistoryRoutes);
app.use('/user', userRoutes);




const PORT = process.env.PORT || 3000;
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' }
});

module.exports.io = io;

io.on('connection', (socket) => {
  console.log('WebSocket client connected:', socket.id);
});

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
async function startApp() {
    await setupOrderBooks();
    await updateCircuitsForToday();

    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

startApp();
