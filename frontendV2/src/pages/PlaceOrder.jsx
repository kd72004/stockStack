import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import {getUserIdFromToken} from '../utils/decodeToken'
import OrderBook from './OrderBook';

export default function PlaceOrder() {
  const { stockId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState('');
  const type = location.state?.type; 
  const user_id = getUserIdFromToken(); 
  

  useEffect(() => {
    axios.get(`/stocks/${stockId}`)
      .then(res => setStock(res.data))
      .catch(err => console.error('Error fetching stock:', err));
  }, [stockId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/order/place', {
        user_id,
        stock_id: stockId,
        qty: parseInt(qty),
        price: parseFloat(price),
        type,
      });
      alert('✅ Order placed!');
      navigate('/watchlist');
    } catch (err) {
      alert('❌ ' + (err.response?.data?.error || 'Order failed'));
    }
  };

  if (!stock) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{type} Order for {stock.stock_name}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1"
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Price (₹)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.01"
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white" required />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          ✅ Place {type} Order
        </button>
      </form>
      <div className="mt-8">
        <OrderBook stockId={stockId} />
      </div>
    </div>
  );
}
