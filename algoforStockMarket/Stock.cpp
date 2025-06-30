#include "Stock.hpp"
#include <random>
#include <ctime> // if you need time for timestamps, not randomness

Stock::Stock(int stockId, const std::string& symbol, const std::string& companyName,
             double openPrice, double upperCircuit, double lowerCircuit, int quantity)
    : stockId(stockId), symbol(symbol), companyName(companyName),
      openPrice(openPrice), upperCircuit(upperCircuit), lowerCircuit(lowerCircuit),
      price(openPrice), dayHigh(openPrice), dayLow(openPrice), availableQuantity(quantity) {}

int Stock::getStockId() const { return stockId; }
const std::string& Stock::getSymbol() const { return symbol; }
const std::string& Stock::getCompanyName() const { return companyName; }
double Stock::getCurrentPrice() const { return price; }
double Stock::getOpenPrice() const { return openPrice; }
double Stock::getDayHigh() const { return dayHigh; }
double Stock::getDayLow() const { return dayLow; }
double Stock::getUpperCircuit() const { return upperCircuit; }
double Stock::getLowerCircuit() const { return lowerCircuit; }
int Stock::getAvailableQuantity() const { return availableQuantity; }

bool Stock::updatePrice(double newPrice) {
    if (newPrice > upperCircuit || newPrice < lowerCircuit)
        return false;
    price = newPrice;
    if (newPrice > dayHigh) dayHigh = newPrice;
    if (newPrice < dayLow) dayLow = newPrice;
    return true;
}

void Stock::increaseQuantity(int qty) {
    availableQuantity += qty;
}

bool Stock::decreaseQuantity(int qty) {
    if (qty > availableQuantity) return false;
    availableQuantity -= qty;
    return true;
}

// ✅ Modern random version
Stock Stock::createAutoStock(int stockId, const std::string& symbol, const std::string& companyName, int quantity) {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_real_distribution<> dist(100.0, 1100.0); // open price range

    double openPrice = dist(gen);
    double upperCircuit = openPrice * 1.10;
    double lowerCircuit = openPrice * 0.90;

    return Stock(stockId, symbol, companyName, openPrice, upperCircuit, lowerCircuit, quantity);
}
