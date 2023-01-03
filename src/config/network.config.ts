import { Currency } from 'src/orders/types/order.prices.types';

type NetworkSettings = {
  enableWebSocket: boolean;
  enableReorgCheck: boolean;
  reorgCheckFrequency: number[];
  realtimeSyncFrequencySeconds: number;
  realtimeSyncMaxBlockLag: number;
  backfillSyncTimeout: number;
  backfillBlockBatchSize: number;
  whitelistedCurrencies: Map<string, Currency>;
  coingecko?: {
    networkId: string;
  };
  nativeCurrencyDecimals: string;
};

export const getNetworkSettings = (): NetworkSettings => {
  const defaultNetworkSettings: NetworkSettings = {
    enableWebSocket: true,
    enableReorgCheck: true,
    realtimeSyncFrequencySeconds: 15,
    realtimeSyncMaxBlockLag: 8,
    backfillBlockBatchSize: 16,
    backfillSyncTimeout: 30,
    reorgCheckFrequency: [1, 5, 10, 30, 60], // In Minutes
    //TODO : DO WE NEED TO WHITELIST ANY OF THE CURRENCIES
    whitelistedCurrencies: new Map([
      [
        '0xceb726e6383468dd8ac0b513c8330cc9fb4024a8',
        {
          contract: '0xceb726e6383468dd8ac0b513c8330cc9fb4024a8',
          name: 'Worms',
          symbol: 'WORMS',
          decimals: 18,
        },
      ],
    ]),
    //TODO : NEED TO CHNAGE THE NETWORKID TO BINANCE ONCE SHIFTED
    coingecko: {
      networkId: 'ethereum',
    },
    nativeCurrencyDecimals: '18',
  };
  return defaultNetworkSettings;
};
