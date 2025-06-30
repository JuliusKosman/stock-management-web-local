const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const { generateForecast, getForecast } = require('../controllers/forecastController');
const router = express.Router();

router.get('/run', verifyToken, generateForecast);
router.get('/', verifyToken, getForecast);
module.exports = router;
