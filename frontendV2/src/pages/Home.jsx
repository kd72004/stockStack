
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
          // axios.get(`/transaction/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-blue-400">🏠 Welcome to StockStack</h2>

      {user && (
        <div className="mb-6 p-4 bg-[#1e293b] rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">👤 {user.name}</h3>
          <p className="text-green-400 mt-2 text-lg">💰 Balance: ₹{user.balance.toFixed(2)}</p>
        </div>
      )}

      {/* Portfolio Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-yellow-400">📊 Top Holdings</h3>
        {portfolio.length === 0 ? (
          <p className="text-gray-400">📭 No holdings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((stock) => {
              const pl = (stock.stock_id.open - stock.price_of_purchase) * stock.qty;
              const isProfit = pl >= 0;
              return (
                <div key={stock._id} className="bg-[#1e293b] p-4 rounded-lg shadow">
                  <h4 className="text-lg font-bold text-blue-300">📈 {stock.stock_id.stock_name}</h4>
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

      {/* Transactions */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-purple-400">🧾 Last 3 Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400">📭 No transactions found.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((txn) => (
              <li key={txn._id} className="bg-[#1e293b] p-3 rounded-lg shadow">
                 <b>{txn.type === 'buy' ? '🟢 Bought' : '🔴 Sold'}</b> <b>{txn.qty}</b> × <b>{txn.stock_name}</b> @ ₹{txn.price} <br />
                🗓️ {formatDate(txn.date)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
  <Link
    to="/watchlist"
    className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-4 rounded-xl shadow hover:shadow-lg text-blue-300 hover:text-white flex items-center gap-3"
  >
    🧿 <span>Go to Watchlist</span> →
  </Link>

  <Link
    to={`/portfolio/${userId}`}
    className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-4 rounded-xl shadow hover:shadow-lg text-blue-300 hover:text-white flex items-center gap-3"
  >
    📁 <span>View Full Portfolio</span> →
  </Link>

  <Link
    to={`/transaction/${userId}`}
    className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-4 rounded-xl shadow hover:shadow-lg text-blue-300 hover:text-white flex items-center gap-3"
  >
    📜 <span>View Transaction History</span> →
  </Link>

  <Link
    to="/home"
    className="bg-[#1e293b] hover:bg-[#1f3a5c] transition duration-200 p-4 rounded-xl shadow hover:shadow-lg text-blue-300 hover:text-white flex items-center gap-3"
  >
    🕹️ <span>Place New Order</span> →
  </Link>
</div>

    </div>
  );
}
