#include <iostream>
#include <queue>
#include <vector>
#include <map>
#include <ctime>
#include <string>

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

// Comparator for Buy Orders 
struct BuyOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price < b.price; // Higher price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity; // Smaller quantity first
    }
};

// Comparator for Sell Orders 
struct SellOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price > b.price; // Lower price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity;
    }
};

// Stock metadata (with circuit limits and live price)
struct Stock {
    int stockId;
    string symbol;
    double openPrice;
    double currentPrice;
    double upperCircuit;
    double lowerCircuit;

    Stock(int id, string sym, double open)
        : stockId(id), symbol(sym), openPrice(open), currentPrice(open) {
        upperCircuit = open * 1.2;
        lowerCircuit = open * 0.9;
    }
};

// Global maps
map<int, Stock> stocks;

// Order books per stock
map<int, pair<
    priority_queue<Order, vector<Order>, BuyOrderComparator>,
    priority_queue<Order, vector<Order>, SellOrderComparator>
>> orderBooks;

void addStock(int stockId, const string& symbol, double openPrice) {
    stocks[stockId] = Stock(stockId, symbol, openPrice);
}

void addOrder(int stockId, const Order& order) {
    if (order.type == OrderType::BUY) {
        orderBooks[stockId].first.push(order);
    } else {
        orderBooks[stockId].second.push(order);
    }
}

void matchOrdersForStock(int stockId) {
    auto& stock = stocks[stockId];
    auto& buyHeap = orderBooks[stockId].first;
    auto& sellHeap = orderBooks[stockId].second;

    while (!buyHeap.empty() && !sellHeap.empty()) {
        Order topBuy = buyHeap.top();
        Order topSell = sellHeap.top();

        // Reject orders outside circuit range
        if (topBuy.price > stock.upperCircuit || topBuy.price < stock.lowerCircuit) {
            buyHeap.pop();
            continue;
        }
        if (topSell.price < stock.lowerCircuit || topSell.price > stock.upperCircuit) {
            sellHeap.pop();
            continue;
        }

        // Match condition
        if (topBuy.price >= topSell.price) {
            int matchedQty = min(topBuy.quantity, topSell.quantity);
            double tradePrice = topSell.price;

            cout << "TRADE EXECUTED for Stock [" << stock.symbol << "]" << endl;
            cout << "Buyer ID: " << topBuy.userId << ", Seller ID: " << topSell.userId << endl;
            cout << "Price: ₹" << tradePrice << ", Quantity: " << matchedQty << endl;
            cout << "---------------------------------------------" << endl;

            stock.currentPrice = tradePrice; // Update price

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
    // Create stocks
    addStock(1, "TATA", 100);       // Upper = 120, Lower = 90
    addStock(2, "RELIANCE", 500);   // Upper = 600, Lower = 450

    // Add orders for TATA
    addOrder(1, Order(1, 101, OrderType::BUY, 110, 5));
    addOrder(1, Order(2, 102, OrderType::BUY, 95, 3));
    addOrder(1, Order(3, 201, OrderType::SELL, 100, 4));  // valid
    addOrder(1, Order(4, 202, OrderType::SELL, 85, 4));   // invalid (below circuit)

    // Add orders for RELIANCE
    addOrder(2, Order(5, 301, OrderType::BUY, 590, 4));
    addOrder(2, Order(6, 401, OrderType::SELL, 600, 2));
    addOrder(2, Order(7, 402, OrderType::SELL, 700, 5)); // invalid (above upper)

    // Match orders
    matchOrdersForStock(1);
    matchOrdersForStock(2);

    return 0;
}
