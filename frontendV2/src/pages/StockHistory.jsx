// src/pages/StockHistory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

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

  const handleOrder = (orderType) => {
    navigate(`/order/place/${stock_id}`, { state: { type: orderType } });
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  if (!history.length) return <div className="p-6 text-white">No history found for this stock.</div>;

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        📊 Price History: {stockName}
      </h2>
      <table className="w-full text-left bg-[#1e293b] rounded-lg overflow-hidden">
        <thead>
          <tr className="text-blue-300">
            <th className="p-2">#</th>
            <th className="p-2">Price</th>
            <th className="p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={entry._id} className="hover:bg-[#334155] border-b border-gray-700">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">₹{entry.price}</td>
              <td className="p-2">{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          onClick={() => handleOrder('BUY')}
        >
          Buy
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          onClick={() => handleOrder('SELL')}
        >
          Sell
        </button>
      </div>
    </div>
  );
}
