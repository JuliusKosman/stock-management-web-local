const { execFile } = require('child_process');
const path = require('path');

exports.generateForecast = (req, res) => {
  const pythonScript = path.join(__dirname, '../arima_forecast.py');
  const inputFile = path.join(__dirname, '../data/Dataset_Stok.xlsx');
  const outputJson = path.join(__dirname, '../data/restock_forecast.json');

  execFile('python', [pythonScript, inputFile, outputJson], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(stdout);
    res.json({ success: true, message: stdout });
  });
};

exports.getForecast = (req, res) => {
  const outputJson = path.join(__dirname, '../data/restock_forecast.json');
  try {
    const data = require(outputJson);
    res.json(data);
  } catch {
    res.status(404).json({ error: "Forecast belum dibuat." });
  }
};
