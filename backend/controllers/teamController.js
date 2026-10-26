const db = require('../config/db');

// GET all teams
const getAllTeams = async (req, res, next) => {
    try {
        const { search, league, division } = req.query;
        const params = [];
        let sql = `
            SELECT t.*, s.name AS stadium_name, s.capacity,
                   COUNT(DISTINCT p.player_id) AS player_count
            FROM teams t
            LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id
            LEFT JOIN players p ON t.team_id = p.team_id AND p.status = 'active'
            WHERE 1=1
        `;
        if (search) { 
            sql += ' AND (t.name LIKE ? OR t.city LIKE ? OR t.abbreviation LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`); 
        }
        if (league) { sql += ' AND t.league = ?'; params.push(league); }
        if (division) { sql += ' AND t.division = ?'; params.push(division); }
        
        sql += ' GROUP BY t.team_id ORDER BY t.league, t.division, t.name';
        const [rows] = await db.execute(sql, params);
        res.json({ success: true, data: rows });
    } catch (err) { 
        next(err); 
    }
};

// GET team by ID
const getTeamById = async (req, res, next) => {
    try {
        const [[team]] = await db.execute(
            `SELECT t.*, s.name AS stadium_name, s.city AS stadium_city, s.capacity, s.surface_type
             FROM teams t LEFT JOIN stadiums s ON t.stadium_id = s.stadium_id WHERE t.team_id = ?`,
            [req.params.id]
        );
        if (!team) return res.status(404).json({ success: false, message: 'Team not found.' });
        const [roster] = await db.execute(
            'SELECT player_id, CONCAT(first_name," ",last_name) AS full_name, position, jersey_number, status FROM players WHERE team_id = ? ORDER BY position',
            [req.params.id]
        );
        res.json({ success: true, data: { ...team, roster } });
    } catch (err) { 
        next(err);
    }
};

// POST create team
const createTeam = async (req, res, next) => {
    try {
        const { name, city, abbreviation, league, division, stadium_id, manager_name, founded_year, world_series_wins } = req.body;
        if (!name || !city || !abbreviation || !league || !division) {
            return res.status(400).json({ success: false, message: 'name, city, abbreviation, league, division required.' });
        }
        const [result] = await db.execute(
            'INSERT INTO teams (name,city,abbreviation,league,division,stadium_id,manager_name,founded_year,world_series_wins) VALUES (?,?,?,?,?,?,?,?,?)',
            [name, city, abbreviation.toUpperCase(), league, division, stadium_id || null, manager_name || null, founded_year || null, world_series_wins || 0]
        );
        res.status(201).json({ success: true, message: 'Team created.', data: { team_id: result.insertId } });
    } catch (err) { 
        next(err); 
    }
};

// PUT update team
const updateTeam = async (req, res, next) => {
    try {
        const { name, city, abbreviation, league, division, stadium_id, manager_name, founded_year, world_series_wins } = req.body;
        await db.execute(
            `UPDATE teams SET name=COALESCE(?,name), city=COALESCE(?,city), abbreviation=COALESCE(?,abbreviation),
             league=COALESCE(?,league), division=COALESCE(?,division), stadium_id=COALESCE(?,stadium_id),
             manager_name=COALESCE(?,manager_name), founded_year=COALESCE(?,founded_year),
             world_series_wins=COALESCE(?,world_series_wins) WHERE team_id=?`,
            [name, city, abbreviation, league, division, stadium_id, manager_name, founded_year, world_series_wins, req.params.id]
        );
        res.json({ success: true, message: 'Team updated.' });
    } catch (err) { 
        next(err);
    }
};

// DELETE team
const deleteTeam = async (req, res, next) => {
    try {
        await db.execute('DELETE FROM teams WHERE team_id = ?', [req.params.id]);
        res.json({ success: true, message: 'Team deleted.' });
    } catch (err) { 
        next(err);
    }
};

// Explicit exports declaration block
module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
};