import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams');
      console.log("Teams API Response:", response.data);
      
      let extractedData = [];
      if (Array.isArray(response.data)) {
        extractedData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      } else if (response.data && response.data.teams) {
        extractedData = response.data.teams;
      }

      // STRICT HIERARCHY FIX: Force teams to sort numerically by team_id (1, 2, 3...)
      const sortedData = [...extractedData].sort((a, b) => a.team_id - b.team_id);

      setTeams(sortedData);
    } catch (err) {
      console.error("Error fetching teams data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchTeams();
}, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>⚾ Loading Franchise Database...</div>;
  if (error) return <div style={{ color: '#f87171', padding: '20px' }}>❌ Connection Error: {error}</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">🏢 Franchise Teams Registry</h1>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Viewing all registered league organizations and active ballparks.</p>
      
      <div style={{ marginTop: '20px', background: '#1e293b', borderRadius: '10px', overflowX: 'auto', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '2px solid #334155' }}>
              <th style={{ padding: '15px' }}>ID</th>
              <th style={{ padding: '15px' }}>Team Name</th>
              <th style={{ padding: '15px' }}>Abbr</th>
              <th style={{ padding: '15px' }}>City</th>
              <th style={{ padding: '15px' }}>League / Division</th>
              <th style={{ padding: '15px' }}>Manager</th>
              <th style={{ padding: '15px' }}>Founded</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>World Series Titles</th>
            </tr>
          </thead>
          <tbody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <tr key={team.team_id} style={{ borderBottom: '1px solid #334155', transition: 'background 0.2s' }}>
                  <td style={{ padding: '15px', color: '#94a3b8', fontWeight: 'bold' }}>#{team.team_id}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#38bdf8' }}>{team.name}</td>
                  <td style={{ padding: '15px' }}><span style={{ background: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '13px' }}>{team.abbreviation}</span></td>
                  <td style={{ padding: '15px' }}>{team.city}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ color: team.league === 'AL' ? '#f87171' : '#60a5fa', fontWeight: 'bold' }}>{team.league}</span> - {team.division}
                  </td>
                  <td style={{ padding: '15px', color: '#cbd5e1' }}>{team.manager_name || 'N/A'}</td>
                  <td style={{ padding: '15px', color: '#94a3b8' }}>{team.founded_year || 'N/A'}</td>
                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#f59e0b' }}>
                    🏆 {team.world_series_wins ?? 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                  No team profiles found in your database table.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teams;