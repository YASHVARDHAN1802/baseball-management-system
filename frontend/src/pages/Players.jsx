import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State for Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    position: 'P',
    jersey_number: '',
    team_id: '',
    nationality: 'American',
    status: 'active'
  });

  // 1. READ: Fetch Players Data
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/players');
      
      let extractedData = [];
      if (Array.isArray(response.data)) {
        extractedData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        extractedData = response.data.data;
      }

      // Enforce numerical sort order by ID
      const sortedData = [...extractedData].sort((a, b) => a.player_id - b.player_id);
      setPlayers(sortedData);
    } catch (err) {
      console.error("Error fetching players:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Modal for Creating
  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      first_name: '',
      last_name: '',
      position: 'P',
      jersey_number: '',
      team_id: '',
      nationality: 'American',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open Modal for Editing
  const handleOpenEdit = (player) => {
    setIsEditing(true);
    setCurrentId(player.player_id);
    setFormData({
      first_name: player.first_name || '',
      last_name: player.last_name || '',
      position: player.position || 'P',
      jersey_number: player.jersey_number || '',
      team_id: player.team_id || '',
      nationality: player.nationality || 'American',
      status: player.status || 'active'
    });
    setIsModalOpen(true);
  };

  // 2 & 3. CREATE & UPDATE: Submit handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE (PUT)
        await axios.put(`http://localhost:5000/api/players/${currentId}`, formData);
      } else {
        // CREATE (POST)
        await axios.post('http://localhost:5000/api/players', formData);
      }
      setIsModalOpen(false);
      fetchPlayers(); // Refresh the list from DBMS
    } catch (err) {
      alert("Error saving record: " + err.message);
    }
  };

  // 4. DELETE: Remove player from system
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this player record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/players/${id}`);
        fetchPlayers(); // Refresh list
      } catch (err) {
        alert("Error deleting record: " + err.message);
      }
    }
  };

  if (loading && players.length === 0) return <div style={{ color: 'white', padding: '20px' }}>Loading DBMS Player profiles...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error connecting to backend data pool: {error}</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🏃 PLAYER DIRECTORY (CRUD ACTIVE)</h2>
        <button 
          onClick={handleOpenCreate}
          style={{ padding: '10px 15px', background: '#e04f33', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Add New Player
        </button>
      </div>

      {players.length === 0 ? (
        <p>No players found in the database table.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1a2230', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#0d131e', color: '#8fa0b5' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Position</th>
              <th style={{ padding: '12px' }}>Jersey #</th>
              <th style={{ padding: '12px' }}>Nationality</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.player_id} style={{ borderBottom: '1px solid #28354a' }}>
                <td style={{ padding: '12px' }}>{player.player_id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{player.first_name} {player.last_name}</td>
                <td style={{ padding: '12px' }}>{player.position}</td>
                <td style={{ padding: '12px' }}>#{player.jersey_number || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{player.nationality}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: player.status === 'active' ? '#1b4332' : '#4a1515', color: player.status === 'active' ? '#75e6a2' : '#ff9494' }}>
                    {player.status}
                  </span>
                </td>
                <td style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => handleOpenEdit(player)}
                    style={{ background: '#23395d', color: '#8cb1f5', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(player.player_id)}
                    style={{ background: '#4a1515', color: '#ff9494', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL SYSTEM OVERLAY */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#131a26', padding: '30px', borderRadius: '8px', width: '400px', border: '1px solid #28354a' }}>
            <h3 style={{ marginBottom: '20px' }}>{isEditing ? '✏️ Edit Player Data' : '➕ Add New Database Entry'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>Position</label>
                  <select name="position" value={formData.position} onChange={handleChange} style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }}>
                    {['P','C','1B','2B','3B','SS','LF','CF','RF','DH'].map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>Jersey #</label>
                  <input type="number" name="jersey_number" value={formData.jersey_number} onChange={handleChange} style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>Team ID</label>
                  <input type="number" name="team_id" value={formData.team_id} onChange={handleChange} style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8fa0b5' }}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '8px', background: '#1c2635', border: '1px solid #28354a', borderRadius: '4px', color: 'white' }}>
                    {['active', 'injured', 'inactive', 'retired'].map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 12px', background: '#28354a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 12px', background: '#e04f33', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;