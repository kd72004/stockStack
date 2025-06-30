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
        console.log("Fetched Transactions:", res.data); 
        setTransactions(res.data);
      } catch (err) {
        console.error("Error fetching transaction history", err);
      }
    };

    fetchTransactions();
  }, [id]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📜 Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <table className="w-full text-sm bg-gray-800 rounded">
          <thead>
            <tr className="text-left border-b border-gray-700">
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
              <tr key={idx} className="border-b border-gray-700">
                <td className="p-2">{tx.stock_name}</td>
                <td className="p-2">{tx.company_name}</td>
                <td className="p-2 capitalize">{tx.type}</td>
                <td className="p-2">₹{tx.price}</td>
                <td className="p-2">{tx.qty}</td>
                <td className="p-2">{new Date(tx.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
