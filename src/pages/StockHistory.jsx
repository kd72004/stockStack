import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // seconds
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function StockHistory() {
  const { stock_id } = useParams();
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

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!history.length) return <div className="p-6 text-white">No history found for this stock.</div>;

  // Prepare data for the chart
  const chartData = history.map((entry) => ({
    price: entry.price,
    time: timeAgo(entry.timestamp),
  })).reverse(); // reverse to show oldest to newest left to right

  // Determine line color: green if last price > first price, else red
  const isUp = chartData.length > 1 && chartData[chartData.length-1].price >= chartData[0].price;
  const lineColor = isUp ? '#22c55e' : '#ef4444';

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        📊 Price History: {stockName}
      </h2>
      <div className="bg-[#1e293b] rounded-lg p-4 mb-6" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fill: '#cbd5e1', fontSize: 12 }} interval={Math.ceil(chartData.length/8)} />
            <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} labelFormatter={v => `Time: ${v}`}/>
            <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 flex gap-4">
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Buy</button>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Sell</button>
      </div>
    </div>
  );
} 