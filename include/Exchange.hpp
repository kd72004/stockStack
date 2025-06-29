#pragma once
#include <vector>
#include <unordered_map>
#include "Order.hpp"
#include "User.hpp"
#include "Stock.hpp"
#include "Portfolio.hpp"

class Exchange {
public:
    void placeOrder(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio);

private:
    std::vector<Order> orderBook; // stores pending orders

    bool executeBuy(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio);
    bool executeSell(Order& order, User& user, Stock& stock, PortfolioEntry& portfolio);
};
