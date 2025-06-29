#include "Exchange.hpp"
#include "OrderValidator.hpp"
#include <iostream>

void Exchange::placeOrder(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio) {
    bool success = false;
    std::string reason;

    if (order.getOrderType() == OrderType::BUY) {
        success = OrderValidator::validateBuy(order, user, reason) && executeBuy(order, user, stock, portfolio);
    } else {
        success = OrderValidator::validateSell(order, portfolio, reason) && executeSell(order, user, stock, portfolio);
    }

    if (success) {
        order.markExecuted();
        std::cout << "✅ Order executed\n";
    } else {
        order.markRejected(reason);
        std::cout << "❌ Order failed: " << reason << "\n";
        orderBook.push_back(order);
    }
}

bool Exchange::executeBuy(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio) {
    int qty = order.getQuantity();
    double totalCost = qty * order.getPrice();
    if (!stock.decreaseQuantity(qty)) return false;

    user.withdraw(totalCost);
    portfolio.addQuantity(qty, order.getPrice());
    return true;
}

bool Exchange::executeSell(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio) {
    int qty = order.getQuantity();
    if (!portfolio.reduceQuantity(qty)) return false;

    stock.increaseQuantity(qty);
    double totalGain = qty * order.getPrice();
    user.deposit(totalGain);
    return true;
}
