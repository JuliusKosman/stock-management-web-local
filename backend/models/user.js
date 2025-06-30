const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      },

    password: DataTypes.STRING,
    role: DataTypes.STRING,
  });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.associate = (models) => {
    User.hasMany(models.ActivityLog, {
      foreignKey: 'user_id',
      as: 'activitylogs'
    });
  };

  return User;
};
