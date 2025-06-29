const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// Endpoint login
router.post('/login', authController.login);

// Endpoint untuk ambil data user saat ini
router.get('/me', verifyToken, authController.me);

// Endpoint update info & change password
router.put('/update-info', verifyToken, authController.updateInfo);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
