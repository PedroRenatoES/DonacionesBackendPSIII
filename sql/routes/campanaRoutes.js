const express = require('express');
const CampanaController = require('../controllers/campanaController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, CampanaController.getAll);
router.get('/:id', authenticateToken, CampanaController.getById);
router.post('/', authenticateToken, CampanaController.create);
router.put('/:id', authenticateToken, CampanaController.update);
router.delete('/:id', authenticateToken, CampanaController.delete);

module.exports = router;