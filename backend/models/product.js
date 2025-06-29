module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    kode_barang: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nama_barang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  Product.associate = (models) => {
  Product.hasMany(models.StockIn, {
    foreignKey: "product_id",
    as: "stockins"
  });

  Product.hasMany(models.StockOut, {
    foreignKey: "product_id",
    as: "stockouts"
  });
};


  return Product;
};
