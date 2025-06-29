    const Stock = require('../models/stock');

    function isSameDay(date1, date2) {
        if (!date1 || !date2) return false;
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    async function updateCircuitsForToday() {
    const stocks = await Stock.find();
    const today = new Date();

    for (const stock of stocks) {
        if ( isSameDay(stock.last_circuit_update, today)) {
        console.log(` Skipping ${stock.stock_name}, circuit already updated today.`);
        continue;
        }

        const price = stock.open; 
        const changePercent = 0.05; // 5%
        const upper = price + price * changePercent;
        const lower = price - price * changePercent;

        stock.upper_circuit = Math.round(upper * 100) / 100;
        stock.lower_circuit = Math.round(lower * 100) / 100;
        stock.last_circuit_update = today;

        await stock.save();
        console.log(` Updated ${stock.stock_name} → ↑ ₹${stock.upper_circuit}, ↓ ₹${stock.lower_circuit}`);
    }
    }

    module.exports = { updateCircuitsForToday };
