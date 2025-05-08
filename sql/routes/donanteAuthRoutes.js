const express = require('express');
const DonanteAuthController = require('../controllers/donanteAuthController');

const router = express.Router();

router.post('/login', DonanteAuthController.login);

module.exports = router;
