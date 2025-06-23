const express = require('express');
const router = express.Router();
const SolicitudesRecoleccionController = require('../controllers/solicitudesRecollecionController');

router.get('/:id_donante', SolicitudesRecoleccionController.getAllByDonante);
router.get('/', SolicitudesRecoleccionController.getAll);
router.get('/:id', SolicitudesRecoleccionController.getById);
router.post('/', SolicitudesRecoleccionController.create);
router.put('/:id', SolicitudesRecoleccionController.update);
router.delete('/:id', SolicitudesRecoleccionController.delete);

module.exports = router;
