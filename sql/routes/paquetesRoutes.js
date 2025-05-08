const express = require('express');
const router = express.Router();
const PaquetesController = require('../controllers/paquetesController');

router.post('/', PaquetesController.create);
router.get('/', PaquetesController.getAll);
router.get('/:id', PaquetesController.getById);
router.put('/:id', PaquetesController.update);
router.delete('/:id', PaquetesController.delete);

module.exports = router;