export type USDAndNativePrices = {
  usdPrice?: string;
  // nativePrice?: string;
};

export type Price = {
  currency: string;
  timestamp: number;
  value: string;
};

export type CurrencyMetadata = {
  coingeckoCurrencyId?: string;
  image?: string;
};

export type Currency = {
  contract: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  metadata?: CurrencyMetadata;
};
