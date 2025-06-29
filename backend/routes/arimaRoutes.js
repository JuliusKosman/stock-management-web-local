const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');
const path = require('path');

// Simpan semua produk ke dalam file JSON
router.get('/sync-products', async (req, res) => {
  try {
    const products = await db.Product.findAll({
      attributes: ['id', 'kode_barang', 'name'],
    });

    const formatted = products.map(p => ({
      product_id: p.kode_barang,
      product_name: p.name,
    }));

    const filePath = path.join(__dirname, '..', 'data', 'all_products.json');
    fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2));

    res.json({ message: '✅ Produk berhasil disinkronkan ke all_products.json' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Gagal menyimpan produk ke file.' });
  }
});

module.exports = router;
