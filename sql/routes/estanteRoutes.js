const express = require('express');
const EstanteController = require('../controllers/estanteController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, EstanteController.getAll);
router.get('/:id', authenticateToken, EstanteController.getById);
router.post('/', authenticateToken, EstanteController.create);
router.put('/:id', authenticateToken, EstanteController.update);
router.delete('/:id', authenticateToken, EstanteController.delete);

module.exports = router;
