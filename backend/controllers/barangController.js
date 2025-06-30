const db = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { kode_barang, nama_barang, jumlah, satuan, kategori } = req.body;
  try {
    const product = await db.Product.create({ kode_barang, nama_barang, jumlah, satuan, kategori });

    await db.ActivityLog.create({
      user_id: req.user.id,
      aksi: 'Add Product',
      deskripsi: `Added product ${nama_barang} (${kode_barang}) with quantity ${jumlah}.`
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const oldName = product.nama_barang;
    const oldQty = product.jumlah;

    await product.update(req.body);

    await db.ActivityLog.create({
      user_id: req.user.id,
      aksi: 'Edit Product',
      deskripsi: `Edited product ${oldName} (${product.kode_barang}): name→${req.body.nama_barang || oldName}, quantity→${req.body.jumlah || oldQty}.`
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await db.ActivityLog.create({
      user_id: req.user.id,
      aksi: 'Delete Product',
      deskripsi: `Deleted product ${product.nama_barang} (${product.kode_barang}).`
    });

    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};
