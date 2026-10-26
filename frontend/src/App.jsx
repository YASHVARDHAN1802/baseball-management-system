import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './components/AuthContext';

// Import newly created files
import Teams from './pages/Teams'; 
import Players from './pages/Players';
import Games from './pages/Games';
import Statistics from './pages/Statistics';
import Injuries from './pages/Injuries';
import Contracts from './pages/Contracts';
import Stadiums from './pages/Stadiums';
import Reports from './pages/Reports';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
          <Sidebar isOpen={true} />
          
          <main style={{ flex: 1, marginLeft: 'var(--sidebar-width, 240px)', padding: '40px', color: 'white' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={
                <div>
                  <h1 className="page-title">📊 Dashboard</h1>
                  <p>Welcome back! Select any category to view live database info.</p>
                </div>
              } />
              <Route path="/teams" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/games" element={<Games />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/injuries" element={<Injuries />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/stadiums" element={<Stadiums />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;