import socket from '../services/socket';
import React, { useEffect, useState } from 'react';


function OrderBook({ stockId }) {
  const [orderBook, setOrderBook] = useState({ buyHeap: [], sellHeap: [] });
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    socket.on('orderBookUpdate', (data) => {
      if (data.stockId === stockId) {
        setOrderBook({ buyHeap: data.buyHeap, sellHeap: data.sellHeap });
      }
    });

    socket.on('tradeExecuted', (trade) => {
      setTrades((prev) => [trade, ...prev]);
    });

    return () => {
      socket.off('orderBookUpdate');
      socket.off('tradeExecuted');
    };
  }, [stockId]);

  // return (
  //   <div>
  //     <h2>Order Book</h2>
  //     <div>
  //       <h3>Buy Orders</h3>
  //       <ul>
  //         {orderBook.buyHeap.map((order, idx) => (
  //           <li key={idx}>
  //             Price: ₹{order.price} | Qty: {order.quantity}
  //           </li>
  //         ))}
  //       </ul>
  //       <h3>Sell Orders</h3>
  //       <ul>
  //         {orderBook.sellHeap.map((order, idx) => (
  //           <li key={idx}>
  //             Price: ₹{order.price} | Qty: {order.quantity}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <h2>Recent Trades</h2>
  //     <ul>
  //       {trades.map((trade, idx) => (
  //         <li key={idx}>
  //           {trade.qty} @ ₹{trade.price} ({trade.stock_name})
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}

export default OrderBook;