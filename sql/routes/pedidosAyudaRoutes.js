const express = require('express');
const PedidosDeAyudaController = require('../controllers/pedidosAyudaController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, PedidosDeAyudaController.getAll);
router.get('/:id', authenticateToken, PedidosDeAyudaController.getById);
router.post('/', authenticateToken, PedidosDeAyudaController.create);
router.put('/:id', authenticateToken, PedidosDeAyudaController.update);
router.delete('/:id', authenticateToken, PedidosDeAyudaController.delete);

module.exports = router;
