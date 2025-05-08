const express = require('express');
const RoleController = require('../controllers/roleController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, RoleController.getAll);
router.get('/:id', authenticateToken, RoleController.getById);
router.post('/', authenticateToken, RoleController.create);
router.put('/:id', authenticateToken, RoleController.update);
router.delete('/:id', authenticateToken, RoleController.delete);

module.exports = router;
