const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { generateForecast, getForecast } = require('../controllers/forecastController');
const router = express.Router();

router.get('/run', verifyToken, generateForecast);     // Trigger training manual
router.get('/', verifyToken, getForecast);             // Ambil data prediksi
module.exports = router;
