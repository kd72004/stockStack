#pragma once
#include <vector>
#include "Stock.hpp"

class Market {
public:
    void simulatePriceMovement(std::vector<Stock>& stocks);
    void openMarket();
    void closeMarket();

private:
    bool isOpen = false;
};
