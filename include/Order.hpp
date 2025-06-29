#pragma once
#include <string>
#include <ctime>

enum class OrderType { BUY, SELL };
enum class OrderStatus { PENDING, EXECUTED, REJECTED };

class Order {
public:
    Order(int orderId, int userId, int stockId, int portfolioId,
          OrderType type, int quantity, double price);

    int getOrderId() const;
    int getUserId() const;
    int getStockId() const;
    int getPortfolioId() const;
    OrderType getOrderType() const;
    int getQuantity() const;
    double getPrice() const;
    std::time_t getTimestamp() const;
    OrderStatus getStatus() const;
    const std::string& getRejectionReason() const;

    void markExecuted();
    void markRejected(const std::string& reason);

private:
    int orderId;
    int userId;
    int stockId;
    int portfolioId;
    OrderType type;
    int quantity;
    double price;
    std::time_t timestamp;
    OrderStatus status;
    std::string rejectionReason;
};
