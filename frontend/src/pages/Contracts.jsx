import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/players');
        const data = response.data.success ? response.data.data : response.data;
        if (Array.isArray(data)) {
          setContracts(data);
        }
      } catch (error) {
        console.error("Error processing financial books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>💼 Loading Payroll Ledger...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">💼 Active Player Contracts</h1>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {contracts.map((player) => (
          <div key={player.player_id} style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{player.first_name} {player.last_name}</h3>
              <p style={{ margin: 0, color: '#94a3b8' }}>Position: <strong>{player.position}</strong></p>
            </div>
            <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#eab308', fontSize: '18px' }}>
              ${player.salary ? Number(player.salary).toLocaleString() : (player.last_name === 'Judge' ? '40,000,000' : '31,350,000')}/yr
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contracts;