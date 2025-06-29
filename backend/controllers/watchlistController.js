    const Watchlist = require('../models/watchlist');
    const Stock = require('../models/stock');

    exports.addToWatchlist = async (req, res) => {
    try {
        const { user_id, stock_id } = req.body;

        const exists = await Watchlist.findOne({ user_id, stock_id });
        if (exists) return res.status(400).json({ error: 'Already in watchlist' });

        await Watchlist.create({ user_id, stock_id });
        res.status(201).json({ message: 'Added to watchlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add to watchlist' });
    }
    };

    exports.getWatchlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const watchlist = await Watchlist.find({ user_id: userId }).populate('stock_id');
        
        const formatted = watchlist.map(item => ({
        stock_name: item.stock_id.stock_name,
        company_name: item.stock_id.company_name,
        open: item.stock_id.open,
        upper_circuit: item.stock_id.upper_circuit,
        lower_circuit: item.stock_id.lower_circuit
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch watchlist' });
    }
    };


    exports.removeFromWatchlist = async (req, res) => {
    try {
        const { user_id, stock_id } = req.body;

        await Watchlist.findOneAndDelete({ user_id, stock_id });
        res.json({ message: 'Removed from watchlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove from watchlist' });
    }
    };


    

exports.getUserWatchlistStocks = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    const watchlistItems = await Watchlist.find({ user_id });

    const stockIds = watchlistItems.map(item => item.stock_id);

    const stocks = await Stock.find({ _id: { $in: stockIds } });

    res.json(stocks);
  } catch (err) {
    console.error("Error fetching user's watchlist stocks", err);
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
};