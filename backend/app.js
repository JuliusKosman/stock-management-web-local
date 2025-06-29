const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

const authRoutes = require('./routes/authRoutes');
const barangRoutes = require('./routes/barangRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', barangRoutes);
app.use('/api/transaksi', transaksiRoutes);

app.get('/', (req, res) => res.send('API Stock Management Running...'));

const forecastRoutes = require('./routes/forecastRoutes');
app.use('/api/forecast', forecastRoutes);

const arimaRoutes = require('./routes/arimaRoutes');
app.use('/api/arima', arimaRoutes);

// Import dan jalankan job ARIMA
require('./schedulers/arimaJob');

// DB Connection
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database connected & synced.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
