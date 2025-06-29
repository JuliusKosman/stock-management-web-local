const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, barangController.getAllProducts);
router.post('/', verifyToken, barangController.createProduct);
router.put('/:id', verifyToken, barangController.updateProduct);
router.delete('/:id', verifyToken, barangController.deleteProduct);

module.exports = router;
