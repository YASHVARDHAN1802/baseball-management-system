const express = require('express');
const router = express.Router();

// Import directly from the CONTROLLER
const teamController = require('../controllers/teamController');

// Helper to provide a fallback function if any controller function is missing/undefined
const safeHandler = (handler, name) => {
    if (typeof handler === 'function') return handler;
    console.warn(`[WARNING]: Controller method teamController.${name} is not defined. Using safe fallback.`);
    return (req, res) => res.status(501).json({ 
        success: false, 
        message: `Method teamController.${name} is not implemented or exported properly.` 
    });
};

// Map routes with safe wrappers to avoid crashing on undefined functions
router.get('/', safeHandler(teamController.getAllTeams, 'getAllTeams'));
router.get('/:id', safeHandler(teamController.getTeamById, 'getTeamById'));
router.post('/', safeHandler(teamController.createTeam, 'createTeam'));
router.put('/:id', safeHandler(teamController.updateTeam, 'updateTeam'));
router.delete('/:id', safeHandler(teamController.deleteTeam, 'deleteTeam'));

module.exports = router;