const express = require('express');
const DonacionesController = require('../controllers/donacionesController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, DonacionesController.getAll);
router.get('/:id', authenticateToken, DonacionesController.getById);
router.post('/', authenticateToken, DonacionesController.create);
router.put('/:id', authenticateToken, DonacionesController.update);
router.patch('/estado/:id', authenticateToken, DonacionesController.updateEstado);
router.delete('/:id', authenticateToken, DonacionesController.delete);

module.exports = router;
