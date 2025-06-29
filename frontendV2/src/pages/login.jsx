import { useState } from 'react';
import InputField from '../components/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email_id, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email_id,
        password
      });
      setMessage('Login successful!');
      localStorage.setItem("token", res.data.token);
      navigate('/home');
    } catch (err) {
      setMessage(' Login failed: ' + err.response.data.message || 'Server error');
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0f172a]">
      <form onSubmit={handleLogin} className="bg-[#1e293b] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">Login</h2>

        <InputField
          label="Email"
          type="email"
          value={email_id}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******"
        />

        <button type="submit" className="bg-blue-600 w-full py-2 mt-2 rounded-md hover:bg-blue-700">
          Login
        </button>
        <p className="text-sm mt-4">
          Don't have an account? <a href="/signup" className="text-blue-400 hover:underline">Signup</a>
        </p>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}
