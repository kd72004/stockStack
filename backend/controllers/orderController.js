    const Order = require('../models/order');
    const Stock = require('../models/stock');
    const User = require('../models/user');
    const Portfolio = require('../models/portfolio');
    const { addOrderToHeap } = require('./orderEngine'); 

    exports.placeOrder = async (req, res) => {
    try {
        const { user_id, stock_id, qty, price, type } = req.body;

        const stock = await Stock.findById(stock_id);
        if (!stock) return res.status(404).json({ error: 'Stock not found' });

        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (type === 'BUY' && price > stock.upper_circuit)
        return res.status(400).json({ error: 'BUY blocked: price exceeds upper circuit' });

        if (type === 'SELL' && price < stock.lower_circuit)
        return res.status(400).json({ error: 'SELL blocked: price below lower circuit' });

        if (type === 'BUY') {
        const totalCost = qty * price;
        if (user.balance < totalCost)
            return res.status(400).json({ error: 'Insufficient balance to buy' });
        }

        if (type === 'SELL') {
        const portfolio = await Portfolio.findOne({ user_id, stock_id });
        if (!portfolio || portfolio.qty < qty)
            return res.status(400).json({ error: 'Not enough stock to sell' });
        }

        const order = await Order.create({
        user_id,
        stock_id,
        qty,
        price,
        type,
        status: 'OPEN'
        });

        const tradeResults=await addOrderToHeap(order);

        return res.status(201).json({
        message: 'Order placed and matching attempted',
        order,
        tradeResults
        });

    } catch (err) {
        console.error(err);
        alert(err.message);
        return res.status(500).json({ error: 'Failed to place order' });
    }
    };
