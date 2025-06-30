import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { getUserIdFromToken } from "../utils/decodeToken";
import { useNavigate } from "react-router-dom";

export default function Watchlist() {
  const [allStocks, setAllStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllStocks();
    fetchWatchlistUser();
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
    if (!user_id) return console.error("No user ID found in token");

    try {
      const res = await axios.post("/watchlist/show", { user_id });
      setWatchlist(res.data);
    } catch (err) {
      console.error("Error fetching watchlist", err);
    }
  };

//   const addToWatchlist = async (stock_id) => {
//     const user_id = getUserIdFromToken();
//     if (!user_id) {
//       console.error("No user ID found in token");
//       return;
//     }

//     try {
//       await axios.post("/watchlist/add", { user_id, stock_id });
//       setAllStocks(prev => prev.filter(stock => stock._id !== stock_id));
//       fetchWatchlistUser();
//     } catch (err) {
//       if (err.response && err.response.status === 400 && err.response.data?.error === "Already in watchlist") {
//         alert(" Stock is already in your watchlist");
//       } else {
//         console.error(" Error adding to watchlist", err);
//       }
//     }
//   };

const addToWatchlist = async (stock_id) => {
  const user_id = getUserIdFromToken();
  if (!user_id) {
    console.error("No user ID found in token");
    return;
  }

  try {
    await axios.post("/watchlist/add", { user_id, stock_id });
    setAllStocks(prev => prev.filter(stock => stock._id !== stock_id));
    fetchWatchlistUser();

    setSearchTerm("");
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data?.error === "Already in watchlist") {
      alert("⚠️ Stock is already in your watchlist");
    } else {
      console.error("❌ Error adding to watchlist", err);
    }
  }
};


  const removeFromWatchlist = async (stock_id) => {
    const user_id = getUserIdFromToken();
    if (!user_id) return console.error("No user ID found in token");

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
    <div className="p-6 bg-gray-900 min-h-screen text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📈 Stock Watchlist</h2>

      <input
        type="text"
        placeholder="Search stocks..."
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-700"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredStocks.map((stock) => (
        <div key={stock._id} className="flex justify-between items-center border-b border-gray-700 py-3">
          <div>
            <div className="text-lg font-semibold">{stock.stock_name} - {stock.company_name}</div>
            <div className="text-sm text-gray-400">Open: ₹{stock.open.toFixed(2)} | Qty: {stock.qty}</div>
          </div>

          <button
            onClick={() => addToWatchlist(stock._id)}
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
          >
            ➕ Add
          </button>
        </div>
      ))}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">📋 My Watchlist</h3>
        {watchlist.length === 0 ? (
          <p className="text-gray-400">No stocks in your watchlist yet.</p>
        ) : (
          watchlist.map((item, i) => (
            <div key={i} className="border-b border-gray-700 py-2">
              <div className="flex justify-between items-center">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
