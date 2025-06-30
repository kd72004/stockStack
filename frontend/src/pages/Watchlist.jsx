import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { getUserIdFromToken } from "../utils/decodeToken";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const [allStocks, setAllStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingStocks, setTrendingStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStocks();
    fetchWatchlistUser();
    fetchTrendingStocks();
  }, []);

  const fetchAllStocks = async () => {
    try {
      const res = await axios.get("/stocks/show");
      setAllStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks", err);
    }
  };

  const fetchWatchlistUser = async () => {
    const user_id = getUserIdFromToken();
    if (!user_id) return;

    try {
      const res = await axios.post("/watchlist/show", { user_id });
      setWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching watchlist", err);
    }
  };

  const fetchTrendingStocks = async () => {
    try {
      const res = await axios.get("/stocks/trending");
      setTrendingStocks(res.data);
    } catch (err) {
      console.error("Error fetching trending stocks", err);
    }
  };

  const addToWatchlist = async (stock_id) => {
    const user_id = getUserIdFromToken();
    if (!user_id) return;

    try {
      await axios.post("/watchlist/add", { user_id, stock_id });
      setAllStocks((prev) => prev.filter((stock) => stock._id !== stock_id));
      fetchWatchlistUser();
      setSearchTerm("");
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data?.error === "Already in watchlist"
      ) {
        alert("⚠️ Stock is already in your watchlist");
      } else {
        console.error("Error adding to watchlist", err);
      }
    }
  };

  const removeFromWatchlist = async (stock_id) => {
    const user_id = getUserIdFromToken();
    if (!user_id) return;

    try {
      await axios.delete("/watchlist/remove", { data: { user_id, stock_id } });
      fetchWatchlistUser();
    } catch (err) {
      console.error("Error removing from watchlist", err);
    }
  };

  const handleStockClick = (stock_id) => {
    navigate(`/stocks/${stock_id}`);
  };

  const filteredStocks =
    searchTerm.trim() === ""
      ? []
      : allStocks.filter((stock) =>
          stock.stock_name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white max-w-5xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">📈 Trending Stocks</h2>
          <div className="space-y-2">
            {trendingStocks.map((stock) => (
              <div key={stock._id} className="flex justify-between bg-gray-800 p-3 rounded-xl hover:bg-gray-700 cursor-pointer" onClick={() => handleStockClick(stock._id)}>
                <span>{stock.stock_name} - ₹{stock.open.toFixed(2)}</span>
                <span className="text-green-400 font-semibold">🔥</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">🔎 Search & Add Stocks</h2>
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="space-y-2">
            {filteredStocks.map((stock) => (
              <div key={stock._id} className="flex justify-between items-center bg-gray-800 p-3 rounded-xl">
                <div>
                  <div className="font-semibold">{stock.stock_name} - {stock.company_name}</div>
                  <div className="text-gray-400 text-sm">Open: ₹{stock.open.toFixed(2)} | Qty: {stock.qty}</div>
                </div>
                <button
                  onClick={() => addToWatchlist(stock._id)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  ➕ Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">📋 My Watchlist ({watchlist.length})</h2>
        {watchlist.length === 0 ? (
          <p className="text-gray-400">You have no stocks in your watchlist yet. Start adding some to track them here!</p>
        ) : (
          watchlist.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded-xl mb-2">
              <span
                onClick={() => handleStockClick(item._id)}
                className="cursor-pointer hover:underline"
              >
                {item.stock_name} - {item.company_name}
              </span>
              <button
                onClick={() => removeFromWatchlist(item._id)}
                className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                ❌ Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
