const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../../middleware/authMiddleware');

// Todas las rutas protegidas
router.get('/total-donaciones', authenticateToken, DashboardController.totalDonaciones);
router.get('/donantes-activos', authenticateToken, DashboardController.donantesActivos);
router.get('/donaciones-por-mes/:anio', authenticateToken, DashboardController.donacionesPorMes);
router.get('/tipo-donaciones', authenticateToken, DashboardController.tipoDonaciones);
router.get('/actividad-reciente', authenticateToken, DashboardController.actividadReciente);

module.exports = router;
