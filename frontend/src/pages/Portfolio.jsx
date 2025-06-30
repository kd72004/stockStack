    import { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from '../axiosConfig';
    import { getUserIdFromToken } from '../utils/decodeToken'; // ✅ Add this import
    import OrderBook from './OrderBook';

    export default function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const navigate = useNavigate();
    const user_id = getUserIdFromToken(); 
    //   console.log(user_id);
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

    return (
        <div className="p-6 bg-[#0f172a] min-h-screen text-white max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-blue-400">📊 My Portfolio</h2>
        <table className="w-full text-left">
            <thead>
            <tr className="border-b border-gray-600">
                <th className="pb-2">Stock</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Purchase Price</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Current Price</th>
                <th className="pb-2">P/L</th>
            </tr>
            </thead>
            <tbody>
            {portfolio.map((entry) => {
                const profitLoss = (entry.stock_id.open - entry.price_of_purchase) * entry.qty;
                const isProfit = profitLoss >= 0;
                return (
                <tr
                    key={entry._id}
                    className="hover:bg-gray-800 cursor-pointer"
                    onClick={() => navigate(`/stock-history/${entry.stock_id._id}`)}
                >
                    <td className="py-2">{entry.stock_id.stock_name}</td>
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
