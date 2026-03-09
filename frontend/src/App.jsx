import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import InterviewRoom from './pages/InterviewRoom';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500/30">
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/setup" element={
            <ProtectedRoute><Setup /></ProtectedRoute>
          } />
          <Route path="/interview/:sessionId" element={
            <ProtectedRoute><InterviewRoom /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';
// import InterviewSetup from './pages/InterviewSetup';
// import InterviewRoom from './pages/InterviewRoom';
// import Auth from './pages/Auth';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <Navbar />
//         <main className="pb-12">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/setup" element={<InterviewSetup />} />
//             <Route path="/interview/:sessionId" element={<InterviewRoom />} />
//             <Route path="/auth" element={<Auth />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;