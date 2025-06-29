const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id','username','email','role']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch(err) {
    res.status(500).json({ message:'Failed to get user', error:err.message });
  }
};


exports.updateInfo = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = req.body.username || user.username;
    await user.save();

    res.json({ message: 'Informasi berhasil diperbarui', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui info', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengganti password', error: err.message });
  }
};
