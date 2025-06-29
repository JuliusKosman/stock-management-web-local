module.exports = (sequelize, DataTypes) => {
  const StockOut = sequelize.define("StockOut", {
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  StockOut.associate = (models) => {
    StockOut.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product" // pastikan aliasnya sama dengan yang digunakan saat eager loading
    });
  };

  return StockOut;
};
