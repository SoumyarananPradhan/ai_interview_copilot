import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('access');
  const activeUser = localStorage.getItem('username');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-cyan-500 font-black text-xl animate-pulse">_&gt;</span>
            <span className="text-zinc-100 font-extrabold text-xl tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
              AI_INTERVIEW<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">.copilot</span>
            </span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated && (
              <>
                <Link 
                  to="/" 
                  className={`font-mono text-xs sm:text-sm uppercase tracking-widest transition-all px-3 py-2 rounded-lg ${
                    isActive('/') 
                      ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                      : 'text-zinc-500 hover:text-cyan-300 hover:bg-zinc-900/50'
                  }`}
                >
                  // Logs
                </Link>
                <Link 
                  to="/setup" 
                  className={`font-mono text-xs sm:text-sm uppercase tracking-widest transition-all px-4 py-2 rounded-lg ${
                    isActive('/setup')
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-400/50'
                      : 'text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  }`}
                >
                  + Initialize
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2 border-l border-zinc-800 pl-4">
                <span className="text-zinc-500 font-mono text-xs hidden sm:block uppercase tracking-widest">
                  User: <span className="text-cyan-400">@{activeUser}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="font-mono text-xs sm:text-sm uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 px-3 py-2 rounded-lg transition-all"
                >
                  [ Exit_Session ]
                </button>
              </div>
            ) : (
              <Link 
                to="/auth"
                className="font-mono text-xs sm:text-sm uppercase tracking-widest text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)]"
              >
                Auth_System &rarr;
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}