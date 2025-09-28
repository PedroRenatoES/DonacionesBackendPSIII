const express = require('express');
const router = express.Router();
const InventarioController = require('../controllers/inventarioController');
const authenticateToken = require('../../middleware/authMiddleware');

router.get('/ubicaciones', authenticateToken, InventarioController.getInventarioConUbicaciones);
router.get('/stock',       InventarioController.getStockPorArticulo);
router.get('/stock/articulo/:id', InventarioController.getStockPorArticuloPorId);
router.get('/stock/estante/:id_estante', InventarioController.getStockPorEstanteId);
router.get('/donaciones/por-almacen', authenticateToken, InventarioController.getDonacionesPorAlmacen);
router.get('/donaciones-por-estante/:idAlmacen', authenticateToken, InventarioController.getDonacionesPorEstante);


module.exports = router;
