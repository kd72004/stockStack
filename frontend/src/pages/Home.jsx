import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { getUserIdFromToken } from '../utils/decodeToken';

export default function Home() {
  const userId = getUserIdFromToken();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userRes, portfolioRes, txnRes] = await Promise.all([
          axios.get(`/user/${userId}`),
          axios.get(`/portfolio/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/transection/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUser(userRes.data);
        setPortfolio(portfolioRes.data.slice(0, 3));
        setTransactions(txnRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };

    if (userId) fetchHomeData();
  }, [userId]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white max-w-5xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-400 animate-pulse">🏠 Welcome to StockStack</h2>

      {user && (
        <div className="mb-6 p-6 bg-[#1e293b] rounded-2xl shadow-2xl text-center">
          <h3 className="text-2xl font-bold">👤 {user.name}</h3>
          <p className="text-green-400 mt-2 text-xl">💰 Balance: ₹{user.balance.toFixed(2)}</p>
        </div>
      )}

      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-4 text-yellow-400">📊 Top Holdings</h3>
        {portfolio.length === 0 ? (
          <p className="text-gray-400">📭 No holdings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portfolio.map((stock) => {
              const pl = (stock.stock_id.open - stock.price_of_purchase) * stock.qty;
              const isProfit = pl >= 0;
              return (
                <div key={stock._id} className="bg-[#1e293b] p-5 rounded-2xl shadow-xl hover:scale-105 transition">
                  <h4 className="text-xl font-bold text-blue-300">📈 {stock.stock_id.stock_name}</h4>
                  <p>🔢 Qty: {stock.qty}</p>
                  <p>💸 Buy @ ₹{stock.price_of_purchase}</p>
                  <p>📍 Now @ ₹{stock.stock_id.open}</p>
                  <p className={isProfit ? 'text-green-400' : 'text-red-400'}>
                    {isProfit ? '📈 Profit' : '📉 Loss'}: ₹{pl.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-4 text-purple-400">🧾 Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400">📭 No transactions found.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((txn) => (
              <li key={txn._id} className="bg-[#1e293b] p-4 rounded-xl shadow hover:bg-[#334155]">
                <b>{txn.type === 'buy' ? '🟢 Bought' : '🔴 Sold'}</b> {txn.qty} × {txn.stock_name} @ ₹{txn.price}
                <div className="text-gray-400 mt-1">🗓️ {new Date(txn.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/watchlist" className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-5 rounded-2xl shadow text-blue-300 hover:text-white flex items-center gap-3">
          🧿 <span>Go to Watchlist</span> →
        </Link>
        <Link to={`/portfolio/${userId}`} className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-5 rounded-2xl shadow text-blue-300 hover:text-white flex items-center gap-3">
          📁 <span>View Full Portfolio</span> →
        </Link>
        <Link to={`/transaction/${userId}`} className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-5 rounded-2xl shadow text-blue-300 hover:text-white flex items-center gap-3">
          📜 <span>Transaction History</span> →
        </Link>
        <Link to="/home" className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-5 rounded-2xl shadow text-blue-300 hover:text-white flex items-center gap-3">
          🕹️ <span>Place New Order</span> →
        </Link>
      </div>

      <div className="mt-10 text-gray-400 text-center text-sm">
        📈 Stay updated with the latest market trends and news! Coming soon: Market News Feed and Analytics Dashboard.
      </div>
    </div>
  );
}