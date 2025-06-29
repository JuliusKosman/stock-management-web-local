const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const db = require('../models');
const transaksiController = require('../controllers/transaksiController');
const verifyToken = require('../middleware/authMiddleware');
const authController = require('../controllers/authController'); 

router.post('/in', verifyToken, transaksiController.stockIn);
router.post('/out', verifyToken, transaksiController.stockOut);
router.get('/in', verifyToken, transaksiController.getAllStockIn);
router.get('/logs', verifyToken, transaksiController.activityLogs);
router.get('/out', verifyToken, transaksiController.getAllStockOut);
router.get('/me', verifyToken, authController.me);

// Endpoint untuk mengirim hasil prediksi ARIMA
router.get("/forecast", (req, res) => {
  const filePath = path.join(__dirname, "../data/restock_forecast.json");
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Gagal membaca file prediksi" });
  }
});


router.get('/logs', verifyToken, async (req, res) => {
  const logs = await db.ActivityLog.findAll({
    include: [{ model: db.User, attributes: ['username'] }],
    order: [['createdAt', 'DESC']]
  });
  res.json(logs);
});


module.exports = router;
