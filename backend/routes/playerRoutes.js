const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// LINE 6 FIX: Explicitly point to your verified controller function
router.get('/', playerController.getPlayers);
// New CRUD operations
router.post('/', playerController.createPlayer);         // Create
router.put('/:id', playerController.updatePlayer);       // Update
router.delete('/:id', playerController.deletePlayer);    // Delete
module.exports = router;


