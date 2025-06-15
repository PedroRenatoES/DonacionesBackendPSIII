const express = require('express');
const router = express.Router();
const PaquetesController = require('../controllers/paquetesController');

router.post('/', PaquetesController.create);
router.get('/enviados', PaquetesController.getAllEnviados);
router.get('/completados', PaquetesController.getAllWithDonaciones);
router.get('/', PaquetesController.getAll);
router.get('/:id', PaquetesController.getById);
router.get('/donantes/:nombre_paquete', PaquetesController.getDonantesByNombrePaquete);
router.put('/marcar-enviado', PaquetesController.marcarComoEnviado);
router.put('/:id', PaquetesController.update);
router.delete('/:id', PaquetesController.delete);

module.exports = router;
