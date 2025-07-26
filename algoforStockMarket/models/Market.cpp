#include "Market.hpp"
#include <cstdlib>
#include <ctime>
using namespace std;
void Market::openMarket() {
    isOpen = true;
}

void Market::closeMarket() {
    isOpen = false;
}

void Market::simulatePriceMovement(vector<Stock>& stocks) {
    if (!isOpen) return;

    srand(time(nullptr));
    for (Stock& stock : stocks) {
        double change = (rand() % 200 - 100) / 100.0; // -1 to +1
        double newPrice = stock.getCurrentPrice() + change;
        if (newPrice >= stock.getLowerCircuit() && newPrice <= stock.getUpperCircuit()) {
            stock.updatePrice(newPrice);
        }
    }
}
