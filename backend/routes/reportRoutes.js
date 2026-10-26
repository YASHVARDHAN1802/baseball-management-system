// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats, getPayrollReport, getTransferReport, getStandings } = require('../controllers/reportsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/dashboard', getDashboardStats);
router.get('/payroll', getPayrollReport);
router.get('/transfers', getTransferReport);
router.get('/standings', getStandings);

module.exports = router;
