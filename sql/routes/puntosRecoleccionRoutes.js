const express = require('express');
const PuntosDeRecoleccionController = require('../controllers/puntosRecoleccionController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, PuntosDeRecoleccionController.getAll);
router.get('/:id', authenticateToken, PuntosDeRecoleccionController.getById);
router.get('/campana/:id_campana', authenticateToken, PuntosDeRecoleccionController.getByCampanaId);
router.post('/', authenticateToken, PuntosDeRecoleccionController.create);
router.put('/:id', authenticateToken, PuntosDeRecoleccionController.update);
router.delete('/:id', authenticateToken, PuntosDeRecoleccionController.delete);

module.exports = router;
