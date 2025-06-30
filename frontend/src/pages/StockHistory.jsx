import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function StockHistory() {
  const { stock_id } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockName, setStockName] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(`/price-history/${stock_id}`);
        setHistory(res.data);
        if (res.data.length > 0 && res.data[0].stock_id?.stock_name) {
          setStockName(res.data[0].stock_id.stock_name);
        }
      } catch (err) {
        console.error("Failed to fetch stock history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [stock_id]);

  const handleOrder = (type) => navigate(`/order/place/${stock_id}`, { state: { type } });

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!history.length) return <div className="p-6 text-white">No history found for this stock.</div>;

  const chartData = history.map((entry) => ({ price: entry.price, time: new Date(entry.timestamp).toLocaleTimeString() }));

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-blue-400 mb-6 text-center animate-pulse">
        📈 {stockName} Stock Price Trend
      </h2>

      <div className="bg-[#1e293b] p-6 rounded-2xl shadow-2xl">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
            <YAxis stroke="#cbd5e1" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-2xl shadow-md transition transform hover:scale-105" onClick={() => handleOrder('BUY')}>Buy Stock</button>
        <button className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl shadow-md transition transform hover:scale-105" onClick={() => handleOrder('SELL')}>Sell Stock</button>
      </div>

      <div className="mt-10 text-gray-300 text-sm text-center">
        <p>Market Status: <span className="text-green-400">Open</span></p>
        <p className="mt-2">Note: Past performance does not guarantee future results. Trade wisely!</p>
      </div>
    </div>
  );
}
