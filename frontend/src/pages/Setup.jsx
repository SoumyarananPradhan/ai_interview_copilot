import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Setup() {
  const [targetRole, setTargetRole] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('sessions/', { target_role: targetRole, difficulty: difficulty });
      navigate(`/interview/${res.data.id}`);
    } catch (err) {
      console.error("Error creating session:", err);
      const djangoError = err.response?.data;
      alert(`System failure: Could not initialize sequence. Details: ${JSON.stringify(djangoError)}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 shadow-[0_0_30px_rgba(34,211,238,0.05)] relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
            Configure <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Simulation</span>
          </h2>
          <p className="text-zinc-500 font-mono text-sm mt-2">Initialize AI Interview Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Target Role // Technology</label>
            <input type="text" required className="w-full bg-zinc-950 text-cyan-300 font-mono border border-zinc-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition placeholder-zinc-700 shadow-inner" placeholder="e.g. Python Backend Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Difficulty Level</label>
            <select className="w-full bg-zinc-950 text-cyan-300 font-mono border border-zinc-800 rounded-xl px-4 py-3 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition shadow-inner appearance-none cursor-pointer" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
              <option value="Beginner" className="bg-zinc-900 text-zinc-300">Level 1: Beginner</option>
              <option value="Intermediate" className="bg-zinc-900 text-zinc-300">Level 2: Intermediate</option>
              <option value="Advanced" className="bg-zinc-900 text-zinc-300">Level 3: Advanced</option>
            </select>
          </div>
          <button type="submit" disabled={loading || !targetRole.trim()} className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            {loading ? <span className="font-mono animate-pulse text-sm uppercase tracking-widest">Compiling Core...</span> : <span className="font-mono text-sm uppercase tracking-widest">Boot Sequence &rarr;</span>}
          </button>
        </form>
      </div>
    </div>
  );
}