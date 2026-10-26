import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stadiums = () => {
  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teams');
        const teamData = response.data.success ? response.data.data : response.data;
        if (Array.isArray(teamData)) {
          // Extract unique stadium profiles from the team listings
          setStadiums(teamData);
        }
      } catch (error) {
        console.error("Error loading stadiums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStadiums();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>🏟️ Loading Stadiums...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">🏟️ Ballparks & Stadiums</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {stadiums.length > 0 ? (
          stadiums.map((stadium) => (
            <div key={stadium.team_id} style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155' }}>
              <h2 style={{ color: '#a855f7', margin: '0 0 10px 0' }}>{stadium.stadium_name || 'Generic Ballpark'}</h2>
              <p>📍 <strong>Location:</strong> {stadium.city}</p>
              <p>🏠 <strong>Home Franchise:</strong> {stadium.name}</p>
              <p>🌱 <strong>Surface Field:</strong> Natural Grass</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8' }}>No stadium records linked with active franchises.</p>
        )}
      </div>
    </div>
  );
};

export default Stadiums;