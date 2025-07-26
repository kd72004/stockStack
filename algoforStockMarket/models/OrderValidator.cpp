#include "OrderValidator.hpp"
using namespace std;
bool OrderValidator::validateBuy(const Order& order, const User& user, string& reason) {
    double requiredAmount = order.getPrice() * order.getQuantity();
    if (user.getBalance() < requiredAmount) {
        reason = "Insufficient balance.";
        return false;
    }
    return true;
}

bool OrderValidator::validateSell(const Order& order, const PortfolioEntry& portfolio, string& reason) {
    if (portfolio.getQuantity() < order.getQuantity()) {
        reason = "Not enough shares to sell.";
        return false;
    }
    return true;
}
