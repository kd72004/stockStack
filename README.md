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
![image](https://github.com/user-attachments/assets/8b4d07e6-0a74-4997-8b71-ee64f8a1675d)

![image](https://github.com/user-attachments/assets/aee70b37-6fcd-489e-bdba-de78aa3cb051)

![image](https://github.com/user-attachments/assets/7d41cf5e-e134-49d7-8ade-4fc67456fdf3)

![image](https://github.com/user-attachments/assets/7bb65892-a994-4e27-8e0c-56da7b8b64c8)

![image](https://github.com/user-attachments/assets/06a75db8-5586-48f9-b705-9b084e15d46a)

![image](https://github.com/user-attachments/assets/f4d642ca-893a-4eb7-b3fa-ed82392d6cb3)


## 📢 Notes

- This project is for educational/demo purposes and does not handle real money or connect to real exchanges.
- Contributions and feedback are welcome!
