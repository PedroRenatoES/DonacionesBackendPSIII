const express = require('express');
const router = express.Router();
const UnidadesController = require('../controllers/unidadesController');

// Ruta para todas las unidades de medida
typeRouterRouter = router.get('/', UnidadesController.getAll);

// Ruta para unidades según nombre de categoría
router.get('/categoria/:nombre_categoria', UnidadesController.getByCategoria);

module.exports = router;