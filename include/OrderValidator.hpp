#pragma once
#include "Order.hpp"
#include "User.hpp"
#include "Portfolio.hpp"

class OrderValidator {
public:
    static bool validateBuy(const Order& order, const User& user, std::string& reason);
    static bool validateSell(const Order& order, const PortfolioEntry& portfolio, std::string& reason);
};
