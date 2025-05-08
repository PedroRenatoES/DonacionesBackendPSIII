const express = require('express');
const DonacionesEnDineroController = require('../controllers/donacionesDineroController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/nombres-cuenta', authenticateToken, DonacionesEnDineroController.getAllNombreCuenta);
router.get('/numeros-cuenta', authenticateToken, DonacionesEnDineroController.getAllNumeroCuenta);
router.get('/nombre-cuenta/:nombre_cuenta', authenticateToken, DonacionesEnDineroController.getByNombreCuenta);
router.get('/numero-cuenta/:numero_cuenta', authenticateToken, DonacionesEnDineroController.getByNumeroCuenta);
router.get('/', authenticateToken, DonacionesEnDineroController.getAll);
router.get('/:id', authenticateToken, DonacionesEnDineroController.getById);
router.post('/', authenticateToken, DonacionesEnDineroController.create);
router.put('/:id', authenticateToken, DonacionesEnDineroController.update);
router.delete('/:id', authenticateToken, DonacionesEnDineroController.delete);

module.exports = router;
