const express = require('express');
const router = express.Router();
const DonacionesRopaController = require('../controllers/donacionRopaController');

// Registrar género y talla tras crear la donación en especie
router.post('/', DonacionesRopaController.create);

// Actualizar género y talla
router.put('/:id', DonacionesRopaController.update);

router.get('/generos', DonacionesRopaController.getGeneros);

router.get('/tallas',  DonacionesRopaController.getTallas);

// Obtener género y talla por donación
router.get('/:id', DonacionesRopaController.getById);

module.exports = router;
