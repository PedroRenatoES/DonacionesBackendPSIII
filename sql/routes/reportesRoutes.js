const express = require('express');
const router = express.Router();
const ReportesController = require('../controllers/reportesController');

router.get('/stock/excel', ReportesController.exportarStockExcel);

module.exports = router;
