const express = require('express');
const AlmacenController = require('../controllers/almacenController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, AlmacenController.getAll);
router.get('/:id', authenticateToken, AlmacenController.getById);
router.post('/', authenticateToken, AlmacenController.create);
router.put('/:id', authenticateToken, AlmacenController.update);
router.delete('/:id', authenticateToken, AlmacenController.delete);

module.exports = router;
