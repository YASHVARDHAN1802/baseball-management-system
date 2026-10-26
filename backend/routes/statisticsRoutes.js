const express = require('express');
const router = express.Router();
const { getAllStats, upsertStats, getLeaderboard, getSeasons, deleteStat } = require('../controllers/statisticsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getAllStats);
router.get('/leaderboard', getLeaderboard);
router.get('/seasons', getSeasons);
router.post('/', upsertStats);
router.delete('/:id', deleteStat);

module.exports = router;
