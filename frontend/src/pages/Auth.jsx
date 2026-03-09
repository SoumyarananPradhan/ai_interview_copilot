import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:8000/api/token/', { username, password });
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        localStorage.setItem('username', username);
        navigate('/');
      } else {
        await axios.post('http://localhost:8000/api/register/', { username, password });
        alert("Clearance granted. You may now log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      if (isLogin) {
        alert("Access Denied: Invalid credentials.");
      } else {
        const errorDetails = err.response?.data ? JSON.stringify(err.response.data) : "Username taken or system error.";
        alert(`Registration Failed: ${errorDetails}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)] relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            {isLogin ? "System " : "Request "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {isLogin ? "Login" : "Access"}
            </span>
          </h2>
          <p className="text-zinc-500 font-mono text-sm mt-2">
            {isLogin ? "Authenticate to access training logs" : "Initialize a new user protocol"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Username</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-950 text-cyan-300 font-mono border border-zinc-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition placeholder-zinc-700 shadow-inner"
              placeholder="> enter_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-zinc-950 text-cyan-300 font-mono border border-zinc-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition placeholder-zinc-700 shadow-inner"
              placeholder="> **********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          >
            {loading ? <span className="font-mono animate-pulse text-sm uppercase tracking-widest">Compiling Clearance...</span> : <span className="font-mono text-sm uppercase tracking-widest">{isLogin ? "Execute Login &rarr;" : "Register Profile &rarr;"}</span>}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-zinc-500 hover:text-cyan-400 font-mono text-xs uppercase tracking-widest transition-colors">
            {isLogin ? "[ Create a new profile ]" : "[ Return to login portal ]"}
          </button>
        </div>
      </div>
    </div>
  );
}