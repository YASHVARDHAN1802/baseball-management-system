// routes/stadiumRoutes.js
const express = require('express');
const router = express.Router();
const { getAllStadiums, getStadiumById, createStadium, updateStadium, deleteStadium } = require('../controllers/stadiumController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getAllStadiums);
router.get('/:id', getStadiumById);
router.post('/', createStadium);
router.put('/:id', updateStadium);
router.delete('/:id', deleteStadium);

module.exports = router;