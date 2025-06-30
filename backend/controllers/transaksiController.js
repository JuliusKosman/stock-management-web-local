const db = require('../models');

exports.stockIn = async (req, res) => {
  const { product_id, jumlah, keterangan } = req.body;
  const userId = req.user.id;

  try {
    const product = await db.Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await db.StockIn.create({ product_id, jumlah, keterangan, tanggal: new Date() });
    await product.update({ jumlah: product.jumlah + jumlah });

    await db.ActivityLog.create({
      user_id: userId,
      aksi: 'Stock In',
      deskripsi: `Add ${jumlah} to product ${product.nama_barang}`
    });

    res.status(201).json({ message: 'Stok masuk berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mencatat stok masuk', error: err.message });
  }
};

exports.stockOut = async (req, res) => {
  const { product_id, jumlah, keterangan } = req.body;
  const userId = req.user.id;

  try {
    const product = await db.Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.jumlah < jumlah) return res.status(400).json({ message: 'Stok tidak mencukupi' });

    await db.StockOut.create({ product_id, jumlah, keterangan, tanggal: new Date() });
    await product.update({ jumlah: product.jumlah - jumlah });

    await db.ActivityLog.create({
      user_id: userId,
      aksi: 'Stock Out',
      deskripsi: `Minus ${jumlah} to product ${product.nama_barang}`
    });

    res.status(201).json({ message: 'Stok keluar berhasil' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mencatat stok keluar', error: err.message });
  }
};

exports.activityLogs = async (req, res) => {
  try {
    const logs = await db.ActivityLog.findAll({
      include: [{
        model: db.User,
        as: 'user',
        attributes: ['username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(logs);
  } catch (err) {
    console.error('Gagal mengambil log aktivitas:', err);
    res.status(500).json({ message: 'Gagal mengambil log aktivitas', error: err.message });
  }
};




exports.getAllStockIn = async (req, res) => {
  try {
    const data = await db.StockIn.findAll({
      include: [{
        model: db.Product,
        as: "product",
        attributes: ["kode_barang", "nama_barang"]
      }],
      order: [["createdAt", "DESC"]]
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data stok masuk" });
  }
};

exports.getAllStockOut = async (req, res) => {
  try {
    const data = await db.StockOut.findAll({
      include: [{
        model: db.Product,
        as: "product",
        attributes: ["id", "kode_barang", "nama_barang"]
      }],
      order: [["createdAt", "DESC"]]
    });
    res.json(data);
  } catch (err) {
    console.error("Gagal mengambil data stok keluar:", err);
    res.status(500).json({ message: "Gagal mengambil data stok keluar", error: err.message });
  }
};


