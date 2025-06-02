const express = require('express');
const DonacionesEnEspecieController = require('../controllers/donacionesEspecieController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, DonacionesEnEspecieController.getAll);
router.get('/:id', authenticateToken, DonacionesEnEspecieController.getById);
router.get('/por-donante/:id', authenticateToken, DonacionesEnEspecieController.getByDonanteId);
router.get('/por-campana/:id_campana', authenticateToken, DonacionesEnEspecieController.getByCampanaId);
router.get('/donantes-por-articulo/:id', DonacionesEnEspecieController.getDonantesPorArticulo);
router.post('/', authenticateToken, DonacionesEnEspecieController.create);
router.put('/espacio', DonacionesEnEspecieController.updateEspacio);
router.put('/:id', authenticateToken, DonacionesEnEspecieController.update);
router.delete('/:id', authenticateToken, DonacionesEnEspecieController.delete);

module.exports = router;
