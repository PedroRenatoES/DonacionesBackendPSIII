const express = require('express');
const router = express.Router();
const SalidasAlmacenController = require('../controllers/salidasAlmacenController');

router.get('/', SalidasAlmacenController.getAll);
router.post('/', SalidasAlmacenController.create);

module.exports = router;
