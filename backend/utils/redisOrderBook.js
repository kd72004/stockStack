// backend/utils/redisOrderBook.js
const Redis = require('ioredis');
const redis = new Redis(); // default localhost:6379

// Save heap (as array) to Redis
async function saveHeap(stockId, type, heapArray) {
    await redis.set(`orderbook:${stockId}:${type}`, JSON.stringify(heapArray));
}

// Load heap (as array) from Redis
async function loadHeap(stockId, type) {
    const data = await redis.get(`orderbook:${stockId}:${type}`);
    return data ? JSON.parse(data) : [];
}

module.exports = { saveHeap, loadHeap };