// routes/contractRoutes.js
const express = require('express');
const router = express.Router();
const { getAllContracts, getContractById, createContract, updateContract, deleteContract, getPayrollReport } = require('../controllers/contractController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getAllContracts);
router.get('/payroll', getPayrollReport);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

module.exports = router;