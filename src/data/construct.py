import csv
from pycoingecko import CoinGeckoAPI

cg = CoinGeckoAPI()

def get_top_cryptos(n):
    coins = cg.get_coins_markets(vs_currency='usd', order='market_cap_desc', per_page=n, page=1)
    return {coin['id']: {'market_cap': coin['market_cap'], 'market_cap_rank': coin['market_cap_rank']} for coin in coins}

def get_start_date(file_name):
    with open(file_name, 'r') as f:
        reader = csv.reader(f)
        next(reader)  # skip the header
        return next(reader)[0]  # return the date in the first row

# 市值前 50 的币种列表
ycryptos = ['BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'SOL-USD', 'USDC-USD', 'STETH-USD', 'XRP-USD', 'TON11419-USD',
            'DOGE-USD', 'ADA-USD', 'SHIB-USD', 'AVAX-USD', 'WBTC-USD', 'DOT-USD', 'TRX-USD', 'WTRX-USD', 'BCH-USD',
            'LINK-USD', 'MATIC-USD', 'ICP-USD', 'LTC-USD', 'NEAR-USD', 'LEO-USD', 'DAI-USD', 'UNI7083-USD',
            'APT21794-USD',
            'ETC-USD', 'MNT27075-USD', 'STX4847-USD', 'FDUSD-USD', 'BTCB-USD', 'FIL-USD', 'OKB-USD', 'CRO-USD',
            'XLM-USD',
            'ATOM-USD', 'RNDR-USD', 'TAO22974-USD', 'ARB11841-USD', 'IMX10603-USD', 'HBAR-USD', 'VET-USD', 'WHBAR-USD',
            'WIF-USD', 'WBETH-USD', 'MKR-USD', 'KAS-USD', 'INJ-USD', 'GRT6719-USD']

# 获取 CoinGecko 的前 50 个加密货币，以及它们的市值和市值排名
coingecko_cryptos = get_top_cryptos(50)

# 创建映射
ticker_map = dict(zip(ycryptos, coingecko_cryptos.items()))

# 输出 JavaScript 对象
print('export const supportedCryptocurrencies = {')
for key, value in ticker_map.items():
    if key in ('USDT-USD', 'USDC-USD'):
        continue
    start_date = get_start_date(f"./prices/{key}.csv")
    print(f"  '{key}': {{")
    print(f"    startDate: '{start_date}',")
    print(f"    marketCap: {value[1]['market_cap']},")
    print(f"    marketCapRank: {value[1]['market_cap_rank']},")
    print("  },")
print('};')
