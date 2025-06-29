#include "Market.hpp"
#include <cstdlib>
#include <ctime>

void Market::openMarket() {
    isOpen = true;
}

void Market::closeMarket() {
    isOpen = false;
}

void Market::simulatePriceMovement(std::vector<Stock>& stocks) {
    if (!isOpen) return;

    std::srand(std::time(nullptr));
    for (Stock& stock : stocks) {
        double change = (std::rand() % 200 - 100) / 100.0; // -1 to +1
        double newPrice = stock.getCurrentPrice() + change;

        // Keep within circuit
        if (newPrice >= stock.getLowerCircuit() && newPrice <= stock.getUpperCircuit()) {
            stock.updatePrice(newPrice);
        }
    }
}
