const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/imagenSolicitudRecogidaController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), controller.uploadImagenSolicitudRecogida);
router.get('/:id', controller.getImagenSolicitudRecogida);

module.exports = router;
