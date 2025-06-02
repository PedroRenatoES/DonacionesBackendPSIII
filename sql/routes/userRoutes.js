const express = require('express');
const UserController = require('../controllers/userController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/inactive/', UserController.getAllInactive);
router.get('/simple', UserController.getAllSimple);
router.get('/:id', authenticateToken, UserController.getById);
router.post('/', UserController.create);
router.post('/simple', UserController.createSimple);
router.put('/:id', authenticateToken, UserController.update);
router.put('/activar/:id', UserController.activateAndGeneratePassword);
router.put('/:id/password', UserController.updatePassword);
router.delete('/:id', UserController.delete);


module.exports = router;
