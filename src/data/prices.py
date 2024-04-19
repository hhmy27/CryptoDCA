import yfinance as yf

cryptos = ['BTC-USD', 'ETH-USD', 'USDT-USD', 'BNB-USD', 'SOL-USD', 'USDC-USD', 'STETH-USD', 'XRP-USD', 'TON11419-USD',
           'DOGE-USD', 'ADA-USD', 'SHIB-USD', 'AVAX-USD', 'WBTC-USD', 'DOT-USD', 'TRX-USD', 'WTRX-USD', 'BCH-USD',
           'LINK-USD', 'MATIC-USD', 'ICP-USD', 'LTC-USD', 'NEAR-USD', 'LEO-USD', 'DAI-USD', 'UNI7083-USD',
           'APT21794-USD',
           'ETC-USD', 'MNT27075-USD', 'STX4847-USD', 'FDUSD-USD', 'BTCB-USD', 'FIL-USD', 'OKB-USD', 'CRO-USD',
           'XLM-USD',
           'ATOM-USD', 'RNDR-USD', 'TAO22974-USD', 'ARB11841-USD', 'IMX10603-USD', 'HBAR-USD', 'VET-USD', 'WHBAR-USD',
           'WIF-USD', 'WBETH-USD', 'MKR-USD', 'KAS-USD', 'INJ-USD', 'GRT6719-USD']

for i, crypto in enumerate(cryptos, 1):
    print('Downloading prices for', crypto, f'({i}/{len(cryptos)})')
    try:
        data = yf.download(crypto)
        data.to_csv(f'{crypto}.csv')
        print(f'Successfully downloaded {crypto} prices.')
    except Exception as e:
        print(f'Failed to download {crypto} prices. Error: {e}')
