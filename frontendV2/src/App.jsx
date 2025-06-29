import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Watchlist from './pages/Watchlist';
import Home from './pages/Home';
import StockDetails from './pages/StockDetails'
import TransactionHistory from "./pages/TransactionHistory";
import { getUserIdFromToken } from "./utils/decodeToken";
import  Portfolio  from "./pages/Portfolio";
import StockHistory from './pages/StockHistory'; 
import PlaceOrder from './pages/PlaceOrder';


const user_id = getUserIdFromToken();


axios.defaults.baseURL = "http://localhost:3000";
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <nav className="flex justify-between items-center p-4 bg-[#1e293b]">
          <h1 className="text-xl font-bold text-blue-400">📈 StockStack</h1>
          <div>
            <Link to="/home" className="mr-4 hover:underline">Home</Link>
            <Link to={`/portfolio/${user_id}`} className="mr-4 hover:underline">Portfolio</Link>
            <Link to={`/watchlist`} className="mr-4 hover:underline">WatchList</Link>
            <Link to={`/transaction/${user_id}`} className="mr-4 hover:underline">TransactionHistory</Link>
            {/* <Link to="/login" className="mr-4 hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link> */}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/stocks/:id" element={<StockDetails />} />
          <Route path="/transaction/:id" element={<TransactionHistory />} />
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/stock-history/:stock_id" element={<StockHistory />} />
           <Route path="/order/place/:stockId" element={<PlaceOrder />} />
          <Route path="/" element={<Login />} />
        </Routes>

      </div>
    </Router>
  );
}
