#include <iostream>
#include <queue>
#include <vector>
#include <map>
#include <ctime>

using namespace std;

enum class OrderType { BUY, SELL };

struct Order {
    int orderId;
    int userId;
    OrderType type;
    double price;
    int quantity;
    time_t timestamp;

    Order(int oid, int uid, OrderType t, double p, int q)
        : orderId(oid), userId(uid), type(t), price(p), quantity(q), timestamp(time(nullptr)) {}
};

struct Stock {
    int stockId;
    string symbol;
    double openPrice;
    double currentPrice;
    double upperCircuit;
    double lowerCircuit;

    Stock(int id, string sym, double open)
        : stockId(id), symbol(sym), openPrice(open), currentPrice(open) {
        upperCircuit = open * 1.10;
        lowerCircuit = open * 0.90;
    }
};

// buy
struct BuyOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price < b.price;               // High price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity;                                 // Smaller qty higher priority
    }
};

// sell
struct SellOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price > b.price;               // Low price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity;                                 // Smaller qty higher priority
    }
};

map<int, Stock> stockMap;

map<int, pair<
    priority_queue<Order, vector<Order>, BuyOrderComparator>,
    priority_queue<Order, vector<Order>, SellOrderComparator>
>> orderBooks;

bool validateOrder(const Order& order) {
    const Stock& stock = stockMap[order.orderId % 100]; 
    if (stock.currentPrice >= stock.upperCircuit && order.type == OrderType::BUY) {
        cout << "BUY BLOCKED: Price at upper circuit for stock " << stock.symbol << endl;
        return false;
    }
    if (stock.currentPrice <= stock.lowerCircuit && order.type == OrderType::SELL) {
        cout << " SELL BLOCKED: Price at lower circuit for stock " << stock.symbol << endl;
        return false;
    }
    return true;
}

void addOrder(int stockId, const Order& order) {
    if (!validateOrder(order)) return;

    if (order.type == OrderType::BUY) {
        orderBooks[stockId].first.push(order);
    } else {
        orderBooks[stockId].second.push(order);
    }
}

void matchOrdersForStock(int stockId) {
    auto& buyHeap = orderBooks[stockId].first;
    auto& sellHeap = orderBooks[stockId].second;
    Stock& stock = stockMap[stockId];

    while (!buyHeap.empty() && !sellHeap.empty()) {
        Order topBuy = buyHeap.top();
        Order topSell = sellHeap.top();

        if (topBuy.price >= topSell.price) {
            int matchedQty = min(topBuy.quantity, topSell.quantity);
            double tradePrice = topSell.price;

            cout << " TRADE EXECUTED for " << stock.symbol << " at Rs. " << tradePrice << endl;
            cout << "Buyer ID: " << topBuy.userId << ", Seller ID: " << topSell.userId << endl;
            cout << "Quantity: " << matchedQty << endl;
            cout << "-----------------------------------------" << endl;

            stock.currentPrice = tradePrice;

            buyHeap.pop();
            sellHeap.pop();

            topBuy.quantity -= matchedQty;
            topSell.quantity -= matchedQty;

            if (topBuy.quantity > 0) buyHeap.push(topBuy);
            if (topSell.quantity > 0) sellHeap.push(topSell);
        } else {
            break;
        }
    }
}

int main() {
    // Create Stocks
    stockMap[1] = Stock(1, "TATA", 100);
    stockMap[2] = Stock(2, "RELIANCE", 500);

    // Add Orders for sid 1 
    addOrder(1, Order(10101, 101, OrderType::BUY, 101, 5));
    addOrder(1, Order(10102, 102, OrderType::BUY, 99, 7));
    addOrder(1, Order(10103, 103, OrderType::BUY, 98, 3));
    addOrder(1, Order(10104, 201, OrderType::SELL, 97, 5));
    addOrder(1, Order(10105, 202, OrderType::SELL, 98, 10));

    // Add Orders for sid 2 
    addOrder(2, Order(10201, 301, OrderType::BUY, 510, 4));
    addOrder(2, Order(10202, 401, OrderType::SELL, 480, 2));

    // Match Trades
    matchOrdersForStock(1);
    matchOrdersForStock(2);

    return 0;
}
