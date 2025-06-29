#include "Order.hpp"
#include <ctime>

Order::Order(int orderId, int userId, int stockId, int portfolioId,
             OrderType type, int quantity, double price)
    : orderId(orderId), userId(userId), stockId(stockId), portfolioId(portfolioId),
      type(type), quantity(quantity), price(price), status(OrderStatus::PENDING), rejectionReason("") {
    timestamp = std::time(nullptr);
}

int Order::getOrderId() const { return orderId; }
int Order::getUserId() const { return userId; }
int Order::getStockId() const { return stockId; }
int Order::getPortfolioId() const { return portfolioId; }
OrderType Order::getOrderType() const { return type; }
int Order::getQuantity() const { return quantity; }
double Order::getPrice() const { return price; }
std::time_t Order::getTimestamp() const { return timestamp; }
OrderStatus Order::getStatus() const { return status; }
const std::string& Order::getRejectionReason() const { return rejectionReason; }

void Order::markExecuted() {
    status = OrderStatus::EXECUTED;
}

void Order::markRejected(const std::string& reason) {
    status = OrderStatus::REJECTED;
    rejectionReason = reason;
}
