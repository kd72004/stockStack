#pragma once
#include <string>

class Stock {
public:
    Stock(int stockId, const std::string& symbol, const std::string& companyName,
        double openPrice, double upperCircuit, double lowerCircuit, int quantity);

    // ✅ Add this line inside public section
    static Stock createAutoStock(int stockId, const std::string& symbol, const std::string& companyName, int quantity);

    int getStockId() const;
    const std::string& getSymbol() const;
    const std::string& getCompanyName() const;
    double getCurrentPrice() const;
    double getOpenPrice() const;
    double getDayHigh() const;
    double getDayLow() const;
    double getUpperCircuit() const;
    double getLowerCircuit() const;
    int getAvailableQuantity() const;

    bool updatePrice(double newPrice); // returns false if outside circuit
    void increaseQuantity(int qty);
    bool decreaseQuantity(int qty);

private:
    int stockId;
    std::string symbol;
    std::string companyName;
    double price;
    double openPrice;
    double dayHigh;
    double dayLow;
    double upperCircuit;
    double lowerCircuit;
    int availableQuantity;
};
