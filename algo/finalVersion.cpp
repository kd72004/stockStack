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

// Max Heap for Buyers
struct BuyOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price < b.price;               // High price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity;                                 // Smaller qty higher priority
    }
};

// Min Heap for Sellers
struct SellOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price > b.price;               // Low price first
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity;                                 // Smaller qty higher priority
    }
};

// Order books: map<stockId, pair<buyHeap, sellHeap>>
map<int, pair<
    priority_queue<Order, vector<Order>, BuyOrderComparator>,
    priority_queue<Order, vector<Order>, SellOrderComparator>
>> orderBooks;

void addOrder(int stockId, const Order& order) {
    if (order.type == OrderType::BUY) {
        orderBooks[stockId].first.push(order);
    } else {
        orderBooks[stockId].second.push(order);
    }
}

void matchOrdersForStock(int stockId) {
    auto& buyHeap = orderBooks[stockId].first;
    auto& sellHeap = orderBooks[stockId].second;

    while (!buyHeap.empty() && !sellHeap.empty()) {
        Order topBuy = buyHeap.top();
        Order topSell = sellHeap.top();

        if (topBuy.price >= topSell.price) {
            int matchedQty = min(topBuy.quantity, topSell.quantity);
            double tradePrice = topSell.price;

            cout << "TRADE EXECUTED for Stock ID: " << stockId << endl;
            cout << "Buyer ID: " << topBuy.userId << ", Seller ID: " << topSell.userId << endl;
            cout << "Price: Rs. " << tradePrice << ", Quantity: " << matchedQty << endl;
            cout << "-----------------------------------------" << endl;

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
    // Example: stockId 1 → TATA, stockId 2 → RELIANCE
    addOrder(1, Order(1, 101, OrderType::BUY, 101, 5));  // TATA
    addOrder(1, Order(2, 102, OrderType::BUY, 99, 7));   // TATA
    addOrder(1, Order(3, 103, OrderType::BUY, 98, 3));   // TATA

    addOrder(1, Order(4, 201, OrderType::SELL, 97, 5));  // TATA
    addOrder(1, Order(5, 202, OrderType::SELL, 98, 10)); // TATA

    addOrder(2, Order(6, 301, OrderType::BUY, 500, 4));  // RELIANCE
    addOrder(2, Order(7, 401, OrderType::SELL, 480, 2)); // RELIANCE

    // Match for TATA
    matchOrdersForStock(1);

    // Match for RELIANCE
    matchOrdersForStock(2);

    return 0;
}
