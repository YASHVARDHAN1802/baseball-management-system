const db = require('../config/db'); // Points directly to your MySQL database pool connection file

// ==========================================
// 1. FETCH ALL SCHEDULED & COMPLETED GAMES
// ==========================================
exports.getGames = async (req, res) => {
    try {
        // Queries the explicit view created in your SQL schema layout
        const [rows] = await db.query('SELECT * FROM vw_game_schedule');
        
        return res.status(200).json({ 
            success: true, 
            data: rows 
        });
    } catch (error) {
        console.error("Error inside getGames controller:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ==========================================
// 2. RECORD OR UPDATE SCORES VIA PROCEDURE
// ==========================================
exports.recordResult = async (req, res) => {
    const { game_id, home_score, away_score, attendance } = req.body;
    
    // Safety check to ensure required variables are passed down
    if (!game_id) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing game_id identifier in payload request." 
        });
    }

    try {
        // Calls the native safe stored procedure created in your database
        await db.query('CALL sp_record_game_result(?, ?, ?, ?)', [
            game_id, 
            home_score || 0, 
            away_score || 0, 
            attendance || null
        ]);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Game match results recorded successfully.' 
        });
    } catch (error) {
        console.error("Error executing sp_record_game_result:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};