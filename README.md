# stockStack

## 📝 How to Run

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/stockstack.git
   cd stockstack
   ```

2. **Backend:**
   - Install dependencies: `cd backend && npm install`
   - Set up `.env` with MongoDB and Redis connection strings
   - Seed the database (optional): `node seedData.js`
   - Start server: `npm start`

3. **Frontend:**
   - Install dependencies: `cd frontend && npm install`
   - Start dev server: `npm run dev`
   - Visit [http://localhost:5173](http://localhost:5173)

## 🧩 Key Highlights

- **Custom Matching Algorithm:**  
  Designed and implemented my own heap-based matching engine for realistic order execution.
- **Real-Time Everything:**  
  Order book, trades, and price updates are pushed instantly to all users.
- **Redis-Powered:**  
  Order book is stored in Redis for speed and multi-server support.
- **WebSocket Integration:**  
  Used Socket.IO for live updates and a seamless trading experience.
- **Scalable & Robust:**  
  Built with production-ready patterns for scaling and reliability.

## 🙋‍♂️ Author

- **Your Name**
- [Your LinkedIn](https://linkedin.com/in/yourprofile)
- [Your GitHub](https://github.com/yourusername)

## 📢 Notes

- This project is for educational/demo purposes and does not handle real money or connect to real exchanges.
- Contributions and feedback are welcome!