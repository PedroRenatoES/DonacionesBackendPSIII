const express = require('express');
const EspacioController = require('../controllers/espacioController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/estante/:id_estante', authenticateToken, EspacioController.getByEstante);
router.get('/por-almacen/:id_almacen', authenticateToken, EspacioController.getByAlmacen);

router.get('/', authenticateToken, EspacioController.getAll);
router.put('/:id_espacio/llenar', EspacioController.llenar);
router.put('/:id_espacio/vaciar', EspacioController.vaciar);


module.exports = router;
