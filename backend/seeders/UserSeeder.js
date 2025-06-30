const db = require('../models');
const bcrypt = require('bcryptjs');

async function seedAdminUser() {
  try {
    await db.sequelize.sync();

    await db.User.create({
      username: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    });
    await db.User.create({
      username: 'Julius',
      email: 'julius@gmail.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user dibuat');

    process.exit();
  } catch (err) {
    console.error('Gagal membuat admin user:', err.message);
    process.exit(1);
  }
}

seedAdminUser();
