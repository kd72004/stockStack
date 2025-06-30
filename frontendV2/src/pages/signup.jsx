import { useState } from 'react';
import InputField from '../components/InputField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Signup() {
  const [name, setName] = useState('');
  const [email_id, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [balance, setBalance] = useState(5000);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/signup', {
        name, email_id, password, balance
      });
      setMessage(' Signup successful!');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
  const errorMessage = err.response?.data?.message || ' Signup failed: Server error';
  setMessage(errorMessage);
}

  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSignup} className="bg-[#1e293b] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Signup</h2>

        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Kalyani"
        />
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

        <button type="submit" className="bg-green-600 w-full py-2 mt-2 rounded-md hover:bg-green-700">
          Sign Up
        </button>
        <p className="text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}
