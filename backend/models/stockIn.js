module.exports = (sequelize, DataTypes) => {
  const StockIn = sequelize.define("StockIn", {
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

  StockIn.associate = (models) => {
    StockIn.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product"
    });
  };

  return StockIn;
};
