const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const controller = require('../controllers/imagenesCampanasController');

router.post('/', upload.single('image'), controller.uploadImagenCampana);
router.get('/:id', controller.getImagenCampana);

module.exports = router;
