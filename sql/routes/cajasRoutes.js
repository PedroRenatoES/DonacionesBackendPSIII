const express = require('express');
const router = express.Router();
const CajaController = require('../controllers/cajasController');

router.get('/', CajaController.getAll);
router.get('/:id', CajaController.getById);
router.get('/por-paquete/:id_paquete', CajaController.getByPaquete);
router.post('/', CajaController.create);
router.put('/:id', CajaController.update);
router.delete('/:id', CajaController.delete);

module.exports = router;
