const express = require('express');
const router = express.Router();
const upload = require('../../middleware/uploadConfig');
const UploadController = require('../controllers/uploadController');
const authenticateToken = require('../../middleware/authMiddleware');

router.post('/upload', authenticateToken, (req, res) => {
  upload.single('imagen')(req, res, err => {
    if (err) {
      console.error('Error multer:', err);
      return res.status(500).json({ error: err.message });
    }
    UploadController.uploadImage(req, res);
  });
});

router.get('/image/:id', authenticateToken, UploadController.getImage);

module.exports = router;
