const express = require('express');
const router = express.Router();
const { getAllInjuries, getInjuryById, createInjury, updateInjury, deleteInjury } = require('../controllers/injuryController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getAllInjuries);
router.get('/:id', getInjuryById);
router.post('/', createInjury);
router.put('/:id', updateInjury);
router.delete('/:id', deleteInjury);

module.exports = router;
