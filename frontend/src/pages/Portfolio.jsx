import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { getUserIdFromToken } from '../utils/decodeToken';

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const navigate = useNavigate();
    const user_id = getUserIdFromToken();

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/portfolio/${user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPortfolio(res.data);
            } catch (err) {
                console.error('Error fetching portfolio:', err);
            }
        };
        if (user_id) fetchPortfolio();
    }, [user_id]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const totalPL = portfolio.reduce((acc, entry) => {
        return acc + (entry.stock_id.open - entry.price_of_purchase) * entry.qty;
    }, 0);

    const totalQty = portfolio.reduce((acc, entry) => acc + entry.qty, 0);

    return (
        <div className="p-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white max-w-5xl mx-auto rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-6 text-blue-400 flex items-center gap-2">📈 My Portfolio</h2>

            <div className="flex justify-between items-center mb-8 bg-gray-700 p-4 rounded-lg">
                <div>Total Stocks: <span className="font-bold text-yellow-400">{portfolio.length}</span></div>
                <div>Total Qty: <span className="font-bold text-yellow-400">{totalQty}</span></div>
                <div>Total P/L: <span className={totalPL >= 0 ? 'text-green-400' : 'text-red-400'}>₹{totalPL.toFixed(2)}</span></div>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-600">
                        <th className="pb-3">Stock</th>
                        <th className="pb-3">Qty</th>
                        <th className="pb-3">Purchase Price</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Current Price</th>
                        <th className="pb-3">P/L</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map((entry) => {
                        const profitLoss = (entry.stock_id.open - entry.price_of_purchase) * entry.qty;
                        const isProfit = profitLoss >= 0;
                        return (
                            <tr
                                key={entry._id}
                                className="hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => navigate(`/stock-history/${entry.stock_id._id}`)}
                            >
                                <td className="py-2 flex items-center gap-2">
                                    📊 <span className="font-medium">{entry.stock_id.stock_name}</span>
                                </td>
                                <td>{entry.qty}</td>
                                <td>₹{entry.price_of_purchase}</td>
                                <td>{formatDate(entry.date_of_purchase)}</td>
                                <td>₹{entry.stock_id.open}</td>
                                <td className={isProfit ? 'text-green-400' : 'text-red-400'}>
                                    ₹{profitLoss.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}