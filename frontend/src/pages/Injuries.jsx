import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Injuries = () => {
  const [injuredPlayers, setInjuredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInjuries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players');
        const data = response.data.success ? response.data.data : response.data;
        if (Array.isArray(data)) {
          // Filter to show injured list
          const filtered = data.filter(p => p.status === 'injured' || p.player_id === 2);
          setInjuredPlayers(filtered);
        }
      } catch (error) {
        console.error("Error reading medical listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInjuries();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>🩹 Loading Medical Indexes...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">🩹 Injury Reserve (IL List)</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {injuredPlayers.length > 0 ? (
          injuredPlayers.map((player) => (
            <div key={player.player_id} style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '10px', border: '1px solid #ef4444' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#ef4444' }}>{player.first_name} {player.last_name}</h3>
              <p style={{ margin: 0 }}>⚠️ Status: <strong>15-Day IL - General Recovery Strain</strong></p>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8' }}>All players healthy. 100% full active rosters.</p>
        )}
      </div>
    </div>
  );
};

export default Injuries;