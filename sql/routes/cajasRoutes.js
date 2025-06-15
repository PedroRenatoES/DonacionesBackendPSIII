const express = require('express');
const router = express.Router();
const CajaController = require('../controllers/cajasController');

router.get('/por-paquete/:id_paquete', CajaController.getByPaquete);
router.get('/', CajaController.getAll);
router.get('/:id', CajaController.getById);
router.post('/', CajaController.create);
router.put('/:id', CajaController.update);
router.delete('/:id', CajaController.delete);

module.exports = router;
