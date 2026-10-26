import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        if (response.data && response.data.success) {
          setGames(response.data.data);
        } else if (Array.isArray(response.data)) {
          setGames(response.data);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>🏟️ Loading Schedule...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1 className="page-title">📅 Match Schedule</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game.game_id} style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>{new Date(game.game_date).toLocaleDateString()}</span>
                <h3 style={{ margin: '5px 0 0 0' }}>{game.home_team || 'Home Team'} <span style={{ color: '#64748b' }}>vs</span> {game.away_team || 'Away Team'}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ padding: '4px 8px', borderRadius: '5px', fontSize: '12px', background: game.status === 'completed' ? '#15803d' : '#1e3a8a' }}>
                  {game.status}
                </span>
                {game.status === 'completed' && (
                  <h4 style={{ margin: '5px 0 0 0', color: '#f59e0b' }}>{game.home_score} - {game.away_score}</h4>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8' }}>No games scheduled or saved in the database.</p>
        )}
      </div>
    </div>
  );
};

export default Games;