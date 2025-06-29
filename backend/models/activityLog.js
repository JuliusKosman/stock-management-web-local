module.exports = (sequelize, DataTypes) => {
  const ActivityLog = sequelize.define('ActivityLog', {
    aksi: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    waktu: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  ActivityLog.associate = (models) => {
    ActivityLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return ActivityLog;
};
