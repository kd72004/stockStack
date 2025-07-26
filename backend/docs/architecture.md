# 🧠 Project Architecture – stockStack

Built a stock market simulator with a custom trading engine and real-time order matching algorithm.
Used Redis for fast, in-memory order book management and periodic polling for live stock price updates.
Implemented user authentication, watchlist, and transaction history for a realistic trading experience.

---

## 📌 List of Objects + Context

### 1. 👤 `User`
- **Context**: Authentication & account management
- **Info**:
  - `user_id`, `username`, `email`, `password`
  - `accountBalance`
  - Used to identify and authorize actions like buying/selling, watching stocks, etc.

---

### 2. 🧾 `Order`
- **Context**: Buy/sell request made by a user
- **Info**:
  - Fields: `order_id`, `user_id`, `stock_id`, `qty`, `price`, `type (BUY/SELL)`, `timestamp`
  - Stored temporarily in Redis for matching
  - Upon match, triggers portfolio & transaction update

---

### 3. 🔀 `Matching Engine`
- **Context**: Real-time trading logic
- **Info**:
  - Works directly with Redis heap
  - `BUY` heap = max-heap (higher price, higher priority)
  - `SELL` heap = min-heap (lower price, higher priority)
  - Continuously matches orders by comparing top entries from both heaps
  - Final matched chage in the order status and add to transection history

---

### 4. 📊 `Stock`
- **Context**: for trading
- **Info**:
  - Fields: `stock_id`, `name`, `symbol`, `qty`, `currentPrice`, `upperCircuit`, `lowerCircuit`
  - Updated on every trade
  - Displayed in leaderboard & user dashboard

---

### 5. 🧺 `Portfolio`
- **Context**: Tracks each user’s holdings
- **Info**:
  - Stores: `user_id`, `stock_id`, `qtyOwned`, `avgBuyingPrice`
  - Updated after each successful `BUY` or `SELL` order
  - Displayed in user's dashboard

---

### 6. 🧾 `TransactionHistory`
- **Context**: Final, executed trades
- **Info**:
  - Fields: `transaction_id`, `buyer_id`, `seller_id`, `stock_id`, `price`, `qty`, `timestamp`
  - Used to analyze past trades and calculate profit/loss

---

### 7. 🕐 `PriceHistory`
- **Context**: Shows price trend for stocks
- **Info**:
  - Fields: `stock_id`, `price`, `timestamp`
  - Used in charting frontend graphs

---

### 8. 👀 `Watchlist`
- **Context**: Allows users to monitor favorite stocks
- **Info**:
  - Fields: `user_id`, `stock_ids[]`
  - Helps in sending notifications or alerts (future scope)

---

### 9. ⚡ `Redis`
- **Context**: In-memory data structure for real-time order book
- **Info**:
  - Keys: `stock:<stock_id>:BUY`, `stock:<stock_id>:SELL`
  - Values: Arrays of `{user_id, qty, price, timestamp}`
  - Essential for speed in matching engine

---
