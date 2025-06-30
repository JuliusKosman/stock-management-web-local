import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import json
import os

file_path = 'Dataset_Stok.xlsx'
output_path = os.path.join(os.path.dirname(__file__), 'data', 'restock_forecast.json')
products_path = os.path.join(os.path.dirname(__file__), 'data', 'all_products.json')

df = pd.read_excel(file_path)
df['Tanggal'] = pd.to_datetime(df['Tanggal'])
df['Jumlah'] = df['Jumlah'].astype(int)

pivot = df.pivot_table(index=['Tanggal','Kode_Barang','Nama_Barang'],
                       columns='Jenis_Transaksi',
                       values='Jumlah',
                       aggfunc='sum',
                       fill_value=0).reset_index()
pivot['stok_harian'] = pivot['masuk'] - pivot['keluar']

forecast_list = []
all_true = []
all_pred = []

for code in pivot['Kode_Barang'].unique():
    grp = pivot[pivot['Kode_Barang'] == code]
    name = grp['Nama_Barang'].iloc[0]
    time_series = grp[['Tanggal', 'stok_harian']].set_index('Tanggal').resample('D').sum().fillna(0)

    if len(time_series) < 30:
        continue

    try:
        split_idx = int(len(time_series) * 0.8)
        train = time_series.iloc[:split_idx]
        test = time_series.iloc[split_idx:]

        model = ARIMA(train, order=(1, 1, 1)).fit()
        forecast_test = model.forecast(steps=len(test))

        y_true = test.values.flatten()
        y_pred = forecast_test
        mse = mean_squared_error(y_true, y_pred)

        all_true.extend(y_true)
        all_pred.extend(y_pred)

        full_forecast = model.forecast(steps=90)
        pred = max(int(full_forecast.sum()), 0)

        forecast_list.append({
            "product_id": code,
            "product_name": name,
            "forecasted_restock": pred,
            "mse": round(mse, 2)
        })

        print(f"{name} ({code}) - MSE: {round(mse, 2)}")

    except Exception as e:
        print(f"Error processing {code} - {name}: {e}")
        continue

if forecast_list:
    average = int(sum(f['forecasted_restock'] for f in forecast_list) / len(forecast_list))
    avg_mse = round(sum(f['mse'] for f in forecast_list) / len(forecast_list), 2)
    total_mse = round(mean_squared_error(all_true, all_pred), 2)
else:
    average = 10
    avg_mse = 0.0
    total_mse = 0.0

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
            "forecasted_restock": average,
            "mse": avg_mse
        })

with open(output_path, 'w') as f:
    json.dump(forecast_list, f, indent=2)

print(f"\nTotal MSE across all products: {total_mse}")
print(f"Forecast ARIMA selesai. Data disimpan di {output_path}")
