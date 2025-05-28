const express = require('express');
const multer = require('multer');
const router = express.Router();
const imagenesCiController = require('../controllers/imagenesCiController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), imagenesCiController.uploadImagenCi);
router.get('/:id', imagenesCiController.getImagenCi);

module.exports = router;
