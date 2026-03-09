import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('sessions/')
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sessions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-cyan-400 font-mono text-xl animate-pulse">Scanning Database Archives...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 p-8 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight mb-2">
              Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Logs</span>
            </h1>
            <p className="text-zinc-500 font-mono text-sm">SYS.RECORD_COUNT: {sessions.length}</p>
          </div>
          <Link 
            to="/setup"
            className="mt-6 sm:mt-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:-translate-y-1 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            + Initialize New Sequence
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500 font-mono text-lg mb-4">No training simulations found in the archives.</p>
            <Link to="/setup" className="text-cyan-400 hover:text-cyan-300 font-mono border-b border-cyan-400/30 pb-1">Begin your first sequence &rarr;</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <div key={session.id} className="bg-zinc-900/60 rounded-xl border border-zinc-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono px-2 py-1 rounded uppercase tracking-widest">
                      {session.difficulty}
                    </span>
                    <span className="text-zinc-600 font-mono text-xs">ID_{session.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-200 mb-2 group-hover:text-cyan-300 transition-colors capitalize">
                    {session.target_role}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-6">
                    {session.questions && session.questions.length > 0 ? `Sequence reached: ${session.questions.length} questions` : "Sequence aborted."}
                  </p>
                </div>
                <Link to={`/interview/${session.id}`} className="text-center w-full bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-mono text-sm py-2 rounded-lg border border-zinc-700/50 hover:border-cyan-500/50 transition-all">
                  Access Terminal &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}