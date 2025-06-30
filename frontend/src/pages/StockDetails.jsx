import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import OrderBook from './OrderBook';


export default function StockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const handleOrder = (orderType) => {
  navigate(`/order/place/${stock._id}`, { state: { type: orderType } });
};


  useEffect(() => {
    axios.get(`/stocks/${id}`)
      .then(res => setStock(res.data))
      .catch(err => console.error("Error fetching stock details", err));
  }, [id]);

  if (!stock) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img src={stock.logo_url} alt={stock.company_name} className="w-16 h-16 rounded bg-white p-1" />
        <div>
          <h2 className="text-3xl font-bold">{stock.stock_name} - {stock.company_name}</h2>
          <p className="text-sm text-gray-400">{stock.sector} | {stock.stock_exchange} | {stock.currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
        <p><strong>📈 Open:</strong> ₹{stock.open}</p>
        <p><strong>📊 Upper Circuit:</strong> ₹{stock.upper_circuit}</p>
        <p><strong>📉 Lower Circuit:</strong> ₹{stock.lower_circuit}</p>
        <p><strong>💼 Quantity:</strong> {stock.qty}</p>
        <p><strong>🏦 Market Cap:</strong> ₹{stock.market_cap}B</p>
        <p><strong>📊 P/E Ratio:</strong> {stock.pe_ratio}</p>
        <p><strong>💰 Dividend Yield:</strong> {stock.dividend_yield}%</p>
        <p><strong>📍 Headquarters:</strong> {stock.headquarters}</p>
        <p><strong>👨‍💼 CEO:</strong> {stock.ceo}</p>
        <p><strong>📅 Founded:</strong> {stock.founded_year}</p>
        <p><strong>🌐 Website:</strong> <a href={stock.website} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{stock.website}</a></p>
        <p><strong>🕒 Last Updated:</strong> {new Date(stock.updatedAt).toLocaleString()}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">📘 About</h3>
        <p className="text-gray-300">{stock.about}</p>
      </div>
      <div className="mt-8">
  <OrderBook stockId={stock._id} />
</div>
    <div className="flex gap-4 mt-6">
  <button
    onClick={() => handleOrder('BUY')}
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
  >
    🛒 Buy
  </button>
  <button
    onClick={() => handleOrder('SELL')}
    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
  >
    💼 Sell
  </button>
</div>


      <button
        onClick={() => navigate("/watchlist")}
        className="mt-8 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
      >
        🔙 Go Back to Watchlist
      </button>
    </div>
  );
}
