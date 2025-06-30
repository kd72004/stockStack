import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";

export default function TransactionHistory() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`/transection/${id}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transaction history", err);
      }
    };
    fetchTransactions();
  }, [id]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-blue-400 mb-6 text-center animate-pulse">
        📜 Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-2xl bg-[#1e293b] p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-blue-300 border-b border-gray-700">
                <th className="p-2">Stock</th>
                <th className="p-2">Company</th>
                <th className="p-2">Type</th>
                <th className="p-2">Price</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-[#334155]">
                  <td className="p-2 font-semibold text-white">{tx.stock_name}</td>
                  <td className="p-2 text-gray-300">{tx.company_name}</td>
                  <td className="p-2 capitalize">{tx.type}</td>
                  <td className="p-2">₹{tx.price}</td>
                  <td className="p-2">{tx.qty}</td>
                  <td className="p-2">{new Date(tx.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-gray-300 text-sm text-center">
        <p>💡 Tip: Regularly review your transactions to stay informed on your portfolio performance.</p>
        <p className="mt-2">📊 Need analytics? Visit the Dashboard for charts and insights!</p>
      </div>
    </div>
  );
}