import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import json
import os

# File Paths
file_path = 'Dataset_Stok.xlsx'
output_path = os.path.join(os.path.dirname(__file__), 'data', 'restock_forecast.json')
products_path = os.path.join(os.path.dirname(__file__), 'data', 'all_products.json')

# Load stock dataset
df = pd.read_excel(file_path)
df['Tanggal'] = pd.to_datetime(df['Tanggal'])
df['Jumlah'] = df['Jumlah'].astype(int)

# Hitung stok harian per produk
pivot = df.pivot_table(index=['Tanggal','Kode_Barang','Nama_Barang'],
                       columns='Jenis_Transaksi',
                       values='Jumlah',
                       aggfunc='sum',
                       fill_value=0).reset_index()
pivot['stok_harian'] = pivot['masuk'] - pivot['keluar']

forecast_list = []

# Proses produk yang ada di dataset
for code in pivot['Kode_Barang'].unique():
    grp = pivot[pivot['Kode_Barang'] == code]
    name = grp['Nama_Barang'].iloc[0]
    time_series = grp[['Tanggal', 'stok_harian']].set_index('Tanggal').resample('D').sum().fillna(0)

    if len(time_series) < 30:
        continue

    try:
        model = ARIMA(time_series, order=(1, 1, 1)).fit()
        forecast = model.forecast(steps=90)
        pred = int(forecast.sum())
        if pred < 0:
            pred = 0

        forecast_list.append({
            "product_id": code,
            "product_name": name,
            "forecasted_restock": pred
        })
    except:
        continue

# Rata-rata forecast untuk fallback
average = int(sum(f['forecasted_restock'] for f in forecast_list) / len(forecast_list)) if forecast_list else 10

# Tambahkan produk baru dari all_products.json
try:
    with open(products_path, 'r') as f:
        all_products = json.load(f)
except:
    all_products = []

existing_ids = set(item['product_id'] for item in forecast_list)

for prod in all_products:
    if prod['product_id'] not in existing_ids:
        forecast_list.append({
            "product_id": prod['product_id'],
            "product_name": prod['product_name'],
            "forecasted_restock": average
        })

# Simpan hasil akhir
with open(output_path, 'w') as f:
    json.dump(forecast_list, f, indent=2)

print(f"✅ Forecast ARIMA selesai. Data disimpan di {output_path}")
