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

struct BuyOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price < b.price; // Max heap
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity; // Smaller qty higher priority
    }
};

struct SellOrderComparator {
    bool operator()(const Order& a, const Order& b) const {
        if (a.price != b.price) return a.price > b.price; // Min heap
        if (a.timestamp != b.timestamp) return a.timestamp > b.timestamp; // Older first
        return a.quantity > b.quantity; // Smaller qty higher priority 
    }
};

priority_queue<Order, vector<Order>, BuyOrderComparator> buyHeap;
priority_queue<Order, vector<Order>, SellOrderComparator> sellHeap;

void matchOrders() {
    while (!buyHeap.empty() && !sellHeap.empty()) {
        Order topBuy = buyHeap.top();
        Order topSell = sellHeap.top();

        if (topBuy.price >= topSell.price) {
            int matchedQty = min(topBuy.quantity, topSell.quantity);
            double tradePrice = topSell.price;

            cout << "TRADE EXECUTED:" << endl;
            cout << "Buyer ID: " << topBuy.userId << ", Seller ID: " << topSell.userId << endl;
            cout << "Price:" << tradePrice << ", Quantity: " << matchedQty << endl;
            cout << "-----------------------------------" << endl;

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
    buyHeap.push(Order(1, 101, OrderType::BUY, 101, 5));
    buyHeap.push(Order(2, 102, OrderType::BUY, 99, 7));
    buyHeap.push(Order(3, 103, OrderType::BUY, 98, 3));

    sellHeap.push(Order(4, 201, OrderType::SELL, 97, 5));
    sellHeap.push(Order(5, 202, OrderType::SELL, 97, 10));

    matchOrders();

    return 0;
}
