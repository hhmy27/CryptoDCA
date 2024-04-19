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

ycryptos = ['BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'SOL-USD', 'USDC-USD', 'STETH-USD', 'XRP-USD', 'TON11419-USD',
            'DOGE-USD', 'ADA-USD', 'SHIB-USD', 'AVAX-USD', 'WBTC-USD', 'DOT-USD', 'TRX-USD', 'WTRX-USD', 'BCH-USD',
            'LINK-USD', 'MATIC-USD', 'ICP-USD', 'LTC-USD', 'NEAR-USD', 'LEO-USD', 'DAI-USD', 'UNI7083-USD',
            'APT21794-USD',
            'ETC-USD', 'MNT27075-USD', 'STX4847-USD', 'FDUSD-USD', 'BTCB-USD', 'FIL-USD', 'OKB-USD', 'CRO-USD',
            'XLM-USD',
            'ATOM-USD', 'RNDR-USD', 'TAO22974-USD', 'ARB11841-USD', 'IMX10603-USD', 'HBAR-USD', 'VET-USD', 'WHBAR-USD',
            'WIF-USD', 'WBETH-USD', 'MKR-USD', 'KAS-USD', 'INJ-USD', 'GRT6719-USD']
for crypto, name in zip(top_cryptos, ycryptos):
    icon_url = get_crypto_icon(crypto)
    download_icon(icon_url, f'crypto_icons/{name}.png')
