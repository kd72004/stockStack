# stockStack

## 📝 How to Run

1. **Clone the repo:**
   ```bash
   git clone https://github.com/kd72004/stockstack.git
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

- **Kalyani**

## IMAGES : 
![image](https://github.com/user-attachments/assets/c44fdc4c-24ba-4a2c-92a8-ab15329016f2)
![image](https://github.com/user-attachments/assets/9e9b64a7-68da-495b-bd87-2e9f1790ab48)
![image](https://github.com/user-attachments/assets/4771376a-6385-47c1-ba00-8416985883ce)
![image](https://github.com/user-attachments/assets/20418c80-3657-4673-a88f-4fa8d4d38fae)
![image](https://github.com/user-attachments/assets/8afa3eea-63f3-4dc5-92b6-419c1444ca8c)


## 📢 Notes

- This project is for educational/demo purposes and does not handle real money or connect to real exchanges.
- Contributions and feedback are welcome!
