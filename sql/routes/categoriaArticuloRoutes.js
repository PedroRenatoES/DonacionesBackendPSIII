const express = require('express');
const CategoriaDeArticuloController = require('../controllers/categoriaArticuloController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, CategoriaDeArticuloController.getAll);
router.get('/:id', authenticateToken, CategoriaDeArticuloController.getById);
router.post('/', authenticateToken, CategoriaDeArticuloController.create);
router.put('/:id', authenticateToken, CategoriaDeArticuloController.update);
router.delete('/:id', authenticateToken, CategoriaDeArticuloController.delete);

module.exports = router;
