const express = require('express');
const DonanteController = require('../controllers/donanteController');
const authenticateToken = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, DonanteController.getAll);
router.get('/:id', authenticateToken, DonanteController.getById);
router.post('/', DonanteController.create);
router.put('/:id', authenticateToken, DonanteController.update);
router.delete('/:id', authenticateToken, DonanteController.delete);

module.exports = router;


