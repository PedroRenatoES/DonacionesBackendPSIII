const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const authenticateToken = require('../../middleware/authMiddleware');

router.get('/ubicaciones', authenticateToken, InventarioController.getInventarioConUbicaciones);
router.get('/stock',       InventarioController.getStockPorArticulo);
router.get('/stock/articulo/:id', InventarioController.getStockPorArticuloPorId);
router.get('/stock/estante/:id_estante', InventarioController.getStockPorEstanteId);


module.exports = router;
