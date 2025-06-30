const db = require('../models');

const products = [
  { kode_barang: 'K929B', nama_barang: 'Keiko 929B' },
  { kode_barang: 'AHD5', nama_barang: 'Amori HD5' },
  { kode_barang: 'AHD325', nama_barang: 'Amori HD325' },
  { kode_barang: 'AHD7', nama_barang: 'Amori HD7' },
  { kode_barang: 'ASB222', nama_barang: 'Amori Sisir Blow 222' },
  { kode_barang: 'GKEI', nama_barang: 'Gunting Keiko' },
  { kode_barang: 'A2219', nama_barang: 'Amori 2219' },
  { kode_barang: 'ACL128', nama_barang: 'Amori CL 128' },
  { kode_barang: 'ACL138', nama_barang: 'Amori CL 138' },
  { kode_barang: 'AHD385', nama_barang: 'Amori HD385' },
  { kode_barang: 'AHC806', nama_barang: 'Amori Clipper 806' },
  { kode_barang: 'ASBA1100', nama_barang: 'Amori Sisir Blow A-100' },
  { kode_barang: 'GKEIP', nama_barang: 'Penipis Keiko' },
  { kode_barang: 'ACL158', nama_barang: 'Amori CL 158' },
  { kode_barang: 'AHC807', nama_barang: 'Amori Clipper 807' },
  { kode_barang: 'A9299B', nama_barang: 'Amori 9299B' },
  { kode_barang: 'A388', nama_barang: 'Amori 388' },
  { kode_barang: 'A288', nama_barang: 'Amori 288' },
];

async function seedProducts() {
  try {
    await db.sequelize.sync();
    for (const p of products) {
      await db.Product.create({ ...p, jumlah: 0 });
    }
    console.log('Produk berhasil disimpan ke database.');
    process.exit();
  } catch (err) {
    console.error('Gagal menyimpan produk:', err.message);
    process.exit(1);
  }
}

seedProducts();
