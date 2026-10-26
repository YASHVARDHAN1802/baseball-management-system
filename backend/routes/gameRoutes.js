const express = require('express');
const router = express.Router();

// Notice the "s" at the end of gameControllers!
const { getGames, recordResult } = require('../controllers/gameController');

router.get('/', getGames);
router.post('/result', recordResult);

module.exports = router;