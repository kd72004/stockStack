#pragma once

class PortfolioEntry {
public:
    PortfolioEntry(int userId, int stockId, int quantity, double buyPrice);

    int getUserId() const;
    int getStockId() const;
    int getQuantity() const;
    double getBuyPrice() const;
    double getCurrentPrice() const;
    double getProfitOrLoss() const;

    void updateCurrentPrice(double price);
    void addQuantity(int qty, double pricePerUnit);
    bool reduceQuantity(int qty);

private:
    int userId;
    int stockId;
    int quantity;
    double buyPrice;
    double currentPrice;
};
