const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.StockIn = require('./stockIn')(sequelize, Sequelize);
db.StockOut = require('./stockOut')(sequelize, Sequelize);
db.ActivityLog = require('./activityLog')(sequelize, Sequelize);

db.Product.hasMany(db.StockIn, { foreignKey: 'product_id' });
db.Product.hasMany(db.StockOut, { foreignKey: 'product_id' });
db.StockIn.belongsTo(db.Product, { foreignKey: 'product_id' });
db.StockOut.belongsTo(db.Product, { foreignKey: 'product_id' });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;
