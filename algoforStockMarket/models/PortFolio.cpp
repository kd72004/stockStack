#include "Portfolio.hpp"
#include "Stock.hpp"
#include "User.hpp"
using namespace std;
PortfolioEntry::PortfolioEntry(int userId, int stockId, int quantity, double buyPrice)
    : userId(userId), stockId(stockId), quantity(quantity), buyPrice(buyPrice), currentPrice(buyPrice) {}

int PortfolioEntry::getUserId() const { return userId; }
int PortfolioEntry::getStockId() const { return stockId; }
int PortfolioEntry::getQuantity() const { return quantity; }
double PortfolioEntry::getBuyPrice() const { return buyPrice; }
double PortfolioEntry::getCurrentPrice() const { return currentPrice; }

double PortfolioEntry::getProfitOrLoss() const {
    return (currentPrice - buyPrice) * quantity;
}

void PortfolioEntry::updateCurrentPrice(double price) {
    currentPrice = price;
}

void PortfolioEntry::addQuantity(int qty, double pricePerUnit) {
    double totalCost = buyPrice * quantity + pricePerUnit * qty;
    quantity += qty;
    buyPrice = totalCost / quantity;
}

bool PortfolioEntry::reduceQuantity(int qty) {
    if (qty > quantity) return false;
    quantity -= qty;
    return true;
}
