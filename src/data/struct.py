import os
import pandas as pd

csv_files = [f for f in os.listdir('prices') if f.endswith('.csv')]

data = {}
for csv_file in csv_files:
    df = pd.read_csv(os.path.join('prices', csv_file), nrows=1)
    data[csv_file[:-4]] = {
        'startDate': df['Date'].iloc[0],
    }

print('export const supportedCryptocurrencies = {')
for key, value in data.items():
    if key in ('USDT-USD', 'USDC-USD'):
        continue
    print(f"  '{key}': {{")
    print(f"    startDate: '{value['startDate']}'")
    print("  },")
print('};')
