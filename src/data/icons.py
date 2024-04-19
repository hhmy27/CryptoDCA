from pycoingecko import CoinGeckoAPI
import requests
import os

cg = CoinGeckoAPI()

def get_top_cryptos(n):
    coins = cg.get_coins_markets(vs_currency='usd', order='market_cap_desc', per_page=n, page=1)
    return [coin['id'] for coin in coins]

def get_crypto_icon(crypto):
    try:
        info = cg.get_coin_by_id(crypto)
        return info['image']['large']
    except Exception as e:
        print(f"Failed to get icon for {crypto}. Error: {e}")

def download_icon(url, filename):
    try:
        response = requests.get(url)
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f'Successfully downloaded icon to {filename}.')
    except Exception as e:
        print(f'Failed to download icon from {url}. Error: {e}')

top_cryptos = get_top_cryptos(50)

os.makedirs('crypto_icons', exist_ok=True)

for crypto in top_cryptos:
    icon_url = get_crypto_icon(crypto)
    download_icon(icon_url, f'crypto_icons/{crypto}.png')
