const express = require('express');
const CatalogoDeArticuloController = require('../controllers/catalogoArticuloController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, CatalogoDeArticuloController.getAll);
router.get('/:id', authenticateToken, CatalogoDeArticuloController.getById);
router.get('/categoria/:id_categoria', authenticateToken, CatalogoDeArticuloController.getByCategoria);
router.post('/', authenticateToken, CatalogoDeArticuloController.create);
router.put('/:id', authenticateToken, CatalogoDeArticuloController.update);
router.delete('/:id', authenticateToken, CatalogoDeArticuloController.delete);

module.exports = router;
