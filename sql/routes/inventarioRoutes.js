const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const authenticateToken = require('../../middleware/authMiddleware');

router.get('/ubicaciones', authenticateToken, InventarioController.getInventarioConUbicaciones);
router.get('/stock',       InventarioController.getStockPorArticulo);

module.exports = router;
