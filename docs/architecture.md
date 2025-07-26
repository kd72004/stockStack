# 🧠 Project Architecture – stockStack

Built a stock market simulator with a custom trading engine and real-time order matching algorithm.
Used Redis for fast, in-memory order book management and periodic polling for live stock price updates.
Implemented user authentication, watchlist, and transaction history for a realistic trading experience.

---

## 📌 List of Objects + Context + er diagram 
<img width="3142" height="1726" alt="image" src="https://github.com/user-attachments/assets/aad57e66-6527-4c66-8a97-a386a29a706d" />

# 📘 Stock Trading Platform: Data Model & Redis Architecture

A complete breakdown of all major entities involved in the trading system, including Redis-based order book design for real-time performance.

---

### 👤 User

**📌 Context:**  
Used for authentication, account management, and linking with orders, portfolio, watchlist, and transactions.

**📄 Description:**  
User has the following attributes:

- name as a string  
- email_id as a unique string  
- password as a string  
- balance as a number with default value 0  
- createdAt and updatedAt for timestamps

**🔄 Interacts With:**

- Order to place buy or sell requests  
- Portfolio to manage holdings  
- TransactionHistory to log completed trades  
- Watchlist to track selected stocks  
- Redis for user ID in order books

---

### 🧾 Order

**📌 Context:**  
Created whenever a user places a buy or sell request. Orders are pushed to Redis for real-time matching.

**📄 Description:**  
Order contains:

- user_id linked to a User  
- stock_id linked to a Stock  
- qty as a number  
- price as a number  
- type which can be either BUY or SELL  
- status which can be OPEN by default, or change to PARTIAL, FILLED, or CANCELLED  
- createdAt and updatedAt for timestamps

**🔄 Interacts With:**

- User who placed the order  
- Stock the order is for  
- Redis which stores the order in heaps  
- TransactionHistory after a match is made  
- Portfolio when ownership changes after matching

---

### 🔀 Matching Engine

**📌 Context:**  
Runs continuously to match buy and sell orders using Redis.

**📄 Description:**  
The engine pulls from Redis keys:

- stock followed by stock ID and BUY for max heap  
- stock followed by stock ID and SELL for min heap

It compares top orders and on a successful match:

- Updates the order status  
- Creates a new TransactionHistory entry  
- Modifies the portfolio for both buyer and seller  
- Decreases the quantity in the Stock

**🔄 Interacts With:**

- Redis to fetch and update orders  
- Order to update statuses  
- TransactionHistory to log trades  
- Portfolio to update holdings  
- Stock to adjust available quantity

---

### 📊 Stock

**📌 Context:**  
Represents a tradable company stock and includes data for the platform and analytics.

**📄 Description:**  
Stock includes the following fields:

- stock_name  
- company_name  
- sector  
- open  
- upper_circuit and lower_circuit  
- qty available for trade  
- market_cap  
- pe_ratio  
- dividend_yield  
- about  
- ceo  
- headquarters  
- createdAt and updatedAt for timestamps

**🔄 Interacts With:**

- Order when user places a trade  
- Portfolio when user owns a stock  
- Watchlist when user follows a stock  
- TransactionHistory for each executed trade  
- PriceHistory to track value changes  
- Redis to manage stock's order book

---

### 🧺 Portfolio

**📌 Context:**  
Tracks the user's holdings in different stocks.

**📄 Description:**  
Portfolio includes:

- user_id linked to the User  
- stock_id linked to the Stock  
- qty indicating how many shares the user owns  
- price_of_purchase  
- date_of_purchase

**🔄 Interacts With:**

- User who owns the shares  
- Stock being held  
- TransactionHistory to reflect updates  
- Order when holdings are modified after matching

---

### 🧾 TransactionHistory

**📌 Context:**  
Keeps a record of successful trades for reporting and profit or loss calculations.

**📄 Description:**  
Transaction record includes:

- user_id  
- stock_id  
- price at which trade happened  
- buy_or_sell to indicate direction  
- qty of shares traded  
- date of the transaction

**🔄 Interacts With:**

- User who completed the trade  
- Stock that was traded  
- Portfolio to update quantity or remove  
- Order to reference matched orders

---

### 🕐 PriceHistory

**📌 Context:**  
Maintains the price trend for each stock for frontend charting and analysis.

**📄 Description:**  
It stores:

- stock_id linked to Stock  
- price value  
- timestamp when price was recorded

**🔄 Interacts With:**

- Stock to map price changes  
- Frontend to display graphs  
- Matching Engine which can update prices during trades

---

### 👀 Watchlist

**📌 Context:**  
Lets users track specific stocks they’re interested in.

**📄 Description:**  
Watchlist includes:

- user_id linked to User  
- stock_id linked to Stock  
- createdAt and updatedAt for timestamps

**🔄 Interacts With:**

- User who created the watchlist  
- Stock being followed  
- Can later integrate with notification system

---

### ⚡ Redis

**📌 Context:**  
Redis is used as a high-speed in-memory store for maintaining live order books and enabling the matching engine.

**📄 Description:**  
Each stock has two Redis keys:

- stock followed by stock ID and BUY  
- stock followed by stock ID and SELL

Each Redis list contains entries like:

- user_id  
- qty  
- price  
- timestamp

Orders are sorted using heaps:

- BUY orders are stored in a max-heap so highest price has priority  
- SELL orders are stored in a min-heap so lowest price is matched first

**🔄 Interacts With:**

- Order for inserting and fetching real-time data  
- Matching Engine as core storage for logic  
- User ID as part of each order entry  
- Stock to organize buy and sell books

---
