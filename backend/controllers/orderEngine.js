// @ts-nocheck
    const mongoose = require('mongoose');
    const { MaxPriorityQueue, MinPriorityQueue } = require('@datastructures-js/priority-queue');

    const Stock = require('../models/stock');
    const Order = require('../models/order');
    const { io } = require('../index'); // adjust path as needed

    const User = require('../models/user');
    const Portfolio = require('../models/portfolio');
    const TransactionHistory = require('../models/transactionHistory');
    const PriceHistory = require('../models/priceHistory'); 
    const { saveHeap, loadHeap } = require('../utils/redisOrderBook');
    const Redis = require('ioredis');
    const Redlock = require('redlock');
    const redis = new Redis();
    const redlock = new Redlock([redis], {
        retryCount: 10,
        retryDelay: 200, // ms
    });
    // function formatOrder(order) {
    //     return {
    //         orderId: order._id.toString(),       
    //         userId: order.user_id.toString(),
    //         stockId: order.stock_id.toString(),
    //         price: order.price,
    //         quantity: order.qty,
    //         timestamp: new Date(order.createdAt).getTime(),
    //     };
    // }

    
    // Custom Comparators
    const buyComparator = (a, b) => {
    if (a.price !== b.price) return b.price - a.price;
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    return a.quantity - b.quantity;
    };

    const sellComparator = (a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
    return a.quantity - b.quantity;
    };

    async function initializeEmptyOrderBooks() {
    const stocks = await Stock.find();
    const orderBooks = new Map();

    for (const stock of stocks) {
        const buyArr = await loadHeap(stock._id.toString(), 'buy');
        const sellArr = await loadHeap(stock._id.toString(), 'sell');
        const buyHeap = new MaxPriorityQueue({ compare: buyComparator, initialValues: buyArr });
        const sellHeap = new MinPriorityQueue({ compare: sellComparator, initialValues: sellArr });

        orderBooks.set(stock._id.toString(), { buyHeap, sellHeap });
    }
    return orderBooks;
    }

async function saveOrderBookToRedis(stockId, buyHeap, sellHeap) {
    await saveHeap(stockId, 'buy', buyHeap.toArray());
    await saveHeap(stockId, 'sell', sellHeap.toArray());
}

    let orderBooks = null;

    async function setupOrderBooks() {
    orderBooks = await initializeEmptyOrderBooks(); 
    }
    
    // orderEngine.js
async function addOrderToHeap(order) {
    const stockId = order.stock_id.toString();
    const lockKey = `lock:orderbook:${stockId}`;
    let lock;
    try {
        // Acquire lock for this stock's order book
        lock = await redlock.acquire([lockKey], 2000); // 2 seconds TTL
        const formattedOrder = {
            orderId: order._id.toString(),
            userId: order.user_id.toString(),
            stockId: order.stock_id.toString(),
            price: order.price,
            quantity: order.qty,
            timestamp: new Date(order.timestamp || order.createdAt).getTime(),
            type: order.type
        };

        const book = orderBooks.get(formattedOrder.stockId);
        if (!book) {
            throw new Error(`Stock ${formattedOrder.stockId} not found in orderBooks`);
        }

        if (formattedOrder.type === 'BUY') {
            book.buyHeap.enqueue(formattedOrder);
        } else {
            book.sellHeap.enqueue(formattedOrder);
        }

        // Save to Redis after adding order
        await saveOrderBookToRedis(formattedOrder.stockId, book.buyHeap, book.sellHeap);

        const tradeResults = await matchOrdersForStock(formattedOrder.stockId);
        return tradeResults;
    } finally {
        // Always release the lock!
        if (lock) await redlock.unlock(lock);
    }
}

    const matchOrdersForStock = async (stockId) => {
            const tradeResults = [];
            const book = orderBooks.get(stockId);
            if (!book) return;
            const { buyHeap, sellHeap } = book;
            if (buyHeap.isEmpty() || sellHeap.isEmpty()) return;
    while (!buyHeap.isEmpty() && !sellHeap.isEmpty()) {
            const topBuy = buyHeap.front();
            const topSell = sellHeap.front();

            const stock = await Stock.findById(stockId);
            if (!stock) return;

            // 1. Circuit Breaker Check
            if (
                topBuy.price > stock.upper_circuit || topBuy.price < stock.lower_circuit
            ) {
                console.warn(` buy price ${topBuy.price} for stock ${stock.stock_name} violates circuit. Removing buy order.`);
                buyHeap.dequeue();
            // Save to Redis after change
            await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
            // Emit order book update
            io.emit('orderBookUpdate', {
                stockId,
                buyHeap: buyHeap.toArray(),
                sellHeap: sellHeap.toArray(),
            });
            continue;
            }
            if (
                topSell.price < stock.lower_circuit || topSell.price > stock.upper_circuit
            ) {
                console.warn(` Sell price ${topSell.price} for stock ${stock.stock_name} violates circuit. Removing sell order.`);
                sellHeap.dequeue();
            // Save to Redis after change
            await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
            // Emit order book update
            io.emit('orderBookUpdate', {
                stockId,
                buyHeap: buyHeap.toArray(),
                sellHeap: sellHeap.toArray(),
            });
            continue; 
            }

            // 2. Price Match Check
            if (topBuy.price < topSell.price) {
                console.info(`buy price (${topBuy.price}) is less than sell price (${topSell.price}). No match possible.`);
            break; 
            }

            const matchedQty = Math.min(topBuy.quantity, topSell.quantity);
            const tradePrice = topSell.price;

            // 3. Balance + Portfolio Validation
            const buyer = await User.findById(topBuy.userId);
            const seller = await User.findById(topSell.userId);
        if (!buyer || !seller) {
            buyHeap.dequeue();
            sellHeap.dequeue();
            // Save to Redis after change
            await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
            // Emit order book update
            io.emit('orderBookUpdate', {
                stockId,
                buyHeap: buyHeap.toArray(),
                sellHeap: sellHeap.toArray(),
            });
            continue;
        }

            const totalCost = matchedQty * tradePrice;

            if (buyer.balance < totalCost) {
                buyHeap.dequeue();
            // Save to Redis after change
            await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
            // Emit order book update
            io.emit('orderBookUpdate', {
                stockId,
                buyHeap: buyHeap.toArray(),
                sellHeap: sellHeap.toArray(),
            });
                continue;
            }

            const sellerPortfolio = await Portfolio.findOne({
                user_id: topSell.userId,
                stock_id: topSell.stockId,
            });

            if (!sellerPortfolio || sellerPortfolio.qty < matchedQty) {
                sellHeap.dequeue();
            // Save to Redis after change
            await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
            // Emit order book update
            io.emit('orderBookUpdate', {
                stockId,
                buyHeap: buyHeap.toArray(),
                sellHeap: sellHeap.toArray(),
            });
            continue;
            }

            //  4. Perform transaction
            buyer.balance -= totalCost;
            seller.balance += totalCost;
            await buyer.save();
            await seller.save();

            //  5. Update Buyer's Portfolio
            let buyerPortfolio = await Portfolio.findOne({
                user_id: topBuy.userId,
                stock_id: topBuy.stockId,
            });

            if (buyerPortfolio) {
                buyerPortfolio.qty += matchedQty;
            } else {
                buyerPortfolio = new Portfolio({
                user_id: topBuy.userId,
                stock_id: topBuy.stockId,
                qty: matchedQty,
                price_of_purchase: tradePrice,
                });
            }
            await buyerPortfolio.save();

            //  6. Update Seller's Portfolio
            sellerPortfolio.qty -= matchedQty;
            await sellerPortfolio.save();

            //  7. Save to Transaction History                                                        
            await TransactionHistory.create([
                {
                user_id: topBuy.userId,
                stock_id: topBuy.stockId,
                price: tradePrice,
                buy_or_sell: 'buy',
                qty: matchedQty,
                },
                {
                user_id: topSell.userId,
                stock_id: topSell.stockId,
                price: tradePrice,
                buy_or_sell: 'sell',
                qty: matchedQty,
                },
            ]);

            // 8. Update stock price and record to price history model
            await PriceHistory.create({
            stock_id: stock._id,
            price: stock.open,
            timestamp: new Date()
            });

            stock.open = tradePrice;
            await stock.save();

            //  9. Update Heaps                                                                                
            buyHeap.dequeue();
            sellHeap.dequeue();
            topBuy.quantity -= matchedQty;
            topSell.quantity -= matchedQty;

            if (topBuy.quantity > 0) buyHeap.enqueue(topBuy);
            if (topSell.quantity > 0) sellHeap.enqueue(topSell);

        // Save to Redis after every heap change
        await saveOrderBookToRedis(stockId, buyHeap, sellHeap);
        // Emit order book update
        io.emit('orderBookUpdate', {
            stockId,
            buyHeap: buyHeap.toArray(),
            sellHeap: sellHeap.toArray(),
        });

            const tradeData = {
                stock_id: stockId,
                stock_name: stock.stock_name,
                price: tradePrice,
                qty: matchedQty,
                buyer_id: topBuy.userId,
                seller_id: topSell.userId,
                buy_order_id: topBuy.orderId,
                sell_order_id: topSell.orderId,
                timestamp: Date.now(),
            };

            // Emit trade executed event
            io.emit('tradeExecuted', tradeData);

            console.log(` Trade: ${matchedQty} units of ${stock.stock_name} @ ₹${tradePrice}`);
            tradeResults.push(tradeData)
        }


        return tradeResults;
};

    module.exports = {
        setupOrderBooks,
        matchOrdersForStock,
        addOrderToHeap
    };

