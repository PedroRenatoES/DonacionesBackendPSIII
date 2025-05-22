const express = require('express');
const UserController = require('../controllers/userController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', authenticateToken, UserController.getById);
router.post('/', UserController.create);
router.put('/:id', authenticateToken, UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
