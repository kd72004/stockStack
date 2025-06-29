import { io } from 'socket.io-client';

// Use your backend's URL and port (change 3000 if needed)
const socket = io('http://localhost:3000');

export default socket;