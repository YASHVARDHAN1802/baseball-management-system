const db = require('../config/db'); // Ensure path matches your database pool config

// MAKE SURE IT EXPORTS AS 'getPlayers'
exports.getPlayers = async (req, res) => {
    try {
        // Safe database execution matching your exact players table schema
        const [rows] = await db.query('SELECT * FROM players');
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Error inside getPlayers controller:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 1. CREATE: Add a new player
// REPLACE JUST THE createPlayer FUNCTION WITH THIS SAFE VERSION
exports.createPlayer = async (req, res) => {
    const { 
        first_name, 
        last_name, 
        date_of_birth, 
        nationality, 
        position, 
        jersey_number, 
        team_id, 
        bats, 
        throws, 
        height_cm, 
        weight_kg, 
        status, 
        debut_date 
    } = req.body;

    try {
        const query = `
            INSERT INTO players (
                first_name, last_name, date_of_birth, nationality, 
                position, jersey_number, team_id, bats, throws, 
                height_cm, weight_kg, status, debut_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Provide strict database-compliant fallbacks for missing fields
        const values = [
            first_name || null,
            last_name || null,
            date_of_birth || null,                  // Safe null for DATE
            nationality || 'American',              // Table default
            position || 'P',                        // Safe fallback for ENUM
            jersey_number ? parseInt(jersey_number) : null,
            team_id ? parseInt(team_id) : null,     // Connects to teams table
            bats || 'R',                            // Default ENUM 'R'
            throws || 'R',                          // Default ENUM 'R'
            height_cm ? parseInt(height_cm) : null,
            weight_kg ? parseInt(weight_kg) : null,
            status || 'active',                     // Default ENUM 'active'
            debut_date || null                      // Safe null for DATE
        ];

        const [result] = await db.query(query, values);
        
        return res.status(201).json({ 
            success: true, 
            message: 'Player added successfully', 
            playerId: result.insertId 
        });
    } catch (error) {
        console.error("Database SQL Execution Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. UPDATE: Edit an existing player's details
exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, nationality, position, jersey_number, team_id, bats, throws, height_cm, weight_kg, status, debut_date } = req.body;
    try {
        const query = `
            UPDATE players 
            SET first_name = ?, last_name = ?, date_of_birth = ?, nationality = ?, position = ?, jersey_number = ?, team_id = ?, bats = ?, throws = ?, height_cm = ?, weight_kg = ?, status = ?, debut_date = ?
            WHERE player_id = ?
        `;
        await db.query(query, [first_name, last_name, date_of_birth, nationality, position, jersey_number, team_id, bats, throws, height_cm, weight_kg, status, debut_date, id]);
        
        return res.status(200).json({ success: true, message: 'Player updated successfully' });
    } catch (error) {
        console.error("Error updating player:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. DELETE: Remove a player from the system
exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM players WHERE player_id = ?', [id]);
        return res.status(200).json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        console.error("Error deleting player:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};