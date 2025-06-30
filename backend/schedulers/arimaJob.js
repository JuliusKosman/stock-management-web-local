const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'arima_forecast.py');

// Jalankan setiap hari pukul 23:59
cron.schedule('59 23 * * *', () => {
  console.log("⏳ Menjalankan retraining ARIMA...");

  exec(`python "${scriptPath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Gagal retraining ARIMA:", err.message);
      return;
    }
    if (stderr) {
      console.error("STDERR:", stderr);
    }

    console.log("ARIMA retrained:");
    console.log(stdout);
  });
});
