import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teams');
        const teamData = response.data.success ? response.data.data : response.data;
        if (Array.isArray(teamData)) {
          // Sort teams locally by championship counts descending
          const sorted = [...teamData].sort((a, b) => (b.world_series_wins || 0) - (a.world_series_wins || 0));
          setTeams(sorted);
        }
      } catch (error) {
        console.error("Error loading standings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>🏆 Sorting Standings...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">🏆 All-Time Championship Standings</h1>
      <div style={{ marginTop: '20px', background: '#1e293b', borderRadius: '10px', overflow: 'hidden', border: '1px solid #334155' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
              <th style={{ padding: '15px' }}>Rank</th>
              <th style={{ padding: '15px' }}>Franchise Name</th>
              <th style={{ padding: '15px' }}>Division</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>World Series Championships</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.team_id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '15px', fontWeight: 'bold', color: index === 0 ? '#f59e0b' : '#fff' }}>#{index + 1}</td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{team.city} {team.name} ({team.abbreviation})</td>
                <td style={{ padding: '15px', color: '#94a3b8' }}>{team.league} {team.division}</td>
                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#e2e8f0' }}>{team.world_series_wins || 0} Titles</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;