import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { parseUnits } from '@ethersproject/units';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { bn } from 'src/common/utils.common';
import { getNetworkSettings } from 'src/config/network.config';
import * as Addresses from '../constants/orders.constants.addresses';
import { AddressZero } from '@ethersproject/constants';
import {
  CurrencyMetadata,
  Price,
  USDAndNativePrices,
} from '../types/order.prices.types';

@Injectable()
export class OrderPrices {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger('OrderPrices');
  chainId = this.rpcProvider.chainId;
  baseProvider = this.rpcProvider.baseProvider;

  USD_DECIMALS = 6;
  // TODO: This should be a per-network setting
  NATIVE_UNIT = bn('1000000000000000000');

  getCurrencyDetails = async (currencyAddress: string) => {
    try {
      // `name`, `symbol` and `decimals` are fetched from on-chain
      const iface = new Interface([
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ]);

      const contract = new Contract(currencyAddress, iface, this.baseProvider);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const metadata: CurrencyMetadata = {};

      const coingeckoNetworkId = getNetworkSettings().coingecko?.networkId;
      if (coingeckoNetworkId) {
        const response = await lastValueFrom(
          this.httpService.get(
            `https://api.coingecko.com/api/v3/coins/${coingeckoNetworkId}/contract/${currencyAddress}`,
          ),
        );
        const result: { id?: string; image?: { large?: string } } =
          response.data;
        // const result: { id?: string; image?: { large?: string } } = await axios
        //   .get(
        //     `https://api.coingecko.com/api/v3/coins/${coingeckoNetworkId}/contract/${currencyAddress}`,
        //     { timeout: 10 * 1000 },
        //   )
        //   .then((response) => response.data);
        if (result.id) {
          metadata.coingeckoCurrencyId = result.id;
        }
        if (result.image?.large) {
          metadata.image = result.image.large;
        }
      }

      return {
        name,
        symbol,
        decimals,
        metadata,
      };
    } catch (error) {
      this,
        this.logger.error(
          `Failed to initially fetch ${currencyAddress} currency details: ${error}`,
        );
    }
  };

  getUpstreamUSDPrice = async (
    currencyAddress: string,
    timestamp: number,
  ): Promise<Price | undefined> => {
    try {
      const date = new Date(timestamp * 1000);
      const truncatedTimestamp = Math.floor(date.valueOf() / 1000);

      const currency = await this.getCurrencyDetails(currencyAddress);
      const coingeckoCurrencyId = currency?.metadata?.coingeckoCurrencyId;

      if (coingeckoCurrencyId) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const url = `https://api.coingecko.com/api/v3/coins/${coingeckoCurrencyId}/history?date=${day}-${month}-${year}`;
        this.logger.log('prices', `Fetching price from Coingecko: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        const result: {
          market_data: {
            current_price: { [symbol: string]: number };
          };
        } = response.data;

        // .get(url, { timeout: 10 * 1000 })
        // .then((response) => response.data);

        const usdPrice = result?.market_data?.current_price?.['usd'];
        if (usdPrice) {
          const value = parseUnits(
            usdPrice.toFixed(this.USD_DECIMALS),
            this.USD_DECIMALS,
          ).toString();

          // await idb.none(
          //   `
          //   INSERT INTO usd_prices (
          //     currency,
          //     timestamp,
          //     value
          //   ) VALUES (
          //     $/currency/,
          //     date_trunc('day', to_timestamp($/timestamp/)),
          //     $/value/
          //   ) ON CONFLICT DO NOTHING
          // `,
          //   {
          //     currency: toBuffer(currencyAddress),
          //     timestamp: truncatedTimestamp,
          //     value,
          //   },
          // );

          return {
            currency: currencyAddress,
            timestamp: truncatedTimestamp,
            value,
          };
        }
      } else if (
        getNetworkSettings().whitelistedCurrencies.has(currencyAddress)
      ) {
        //  Whitelisted currencies are 1:1 with USD
        const value = '1';

        // await idb.none(
        //   `
        //     INSERT INTO usd_prices (
        //       currency,
        //       timestamp,
        //       value
        //     ) VALUES (
        //       $/currency/,
        //       date_trunc('day', to_timestamp($/timestamp/)),
        //       $/value/
        //     ) ON CONFLICT DO NOTHING
        //   `,
        //   {
        //     currency: toBuffer(currencyAddress),
        //     timestamp: truncatedTimestamp,
        //     value,
        //   },
        // );

        return {
          currency: currencyAddress,
          timestamp: truncatedTimestamp,
          value,
        };
      }
    } catch (error) {
      this.logger.error(
        'prices',
        `Failed to fetch upstream USD price for ${currencyAddress} and timestamp ${timestamp}: ${error}`,
      );
    }

    return undefined;
  };

  // getCachedUSDPrice = async (
  //   currencyAddress: string,
  //   timestamp: number,
  // ): Promise<Price | undefined> =>
  //   idb
  //     .oneOrNone(
  //       `
  //         SELECT
  //           extract('epoch' from usd_prices.timestamp) AS "timestamp",
  //           usd_prices.value
  //         FROM usd_prices
  //         WHERE usd_prices.currency = $/currency/
  //           AND usd_prices.timestamp <= date_trunc('day', to_timestamp($/timestamp/))
  //         ORDER BY usd_prices.timestamp DESC
  //         LIMIT 1
  //       `,
  //       {
  //         currency: toBuffer(currencyAddress),
  //         timestamp,
  //       },
  //     )
  //     .then((data) =>
  //       data
  //         ? {
  //             currency: currencyAddress,
  //             timestamp: data.timestamp,
  //             value: data.value,
  //           }
  //         : undefined,
  //     )
  //     .catch(() => undefined);

  // USD_PRICE_MEMORY_CACHE = new Map<string, Price>();
  getAvailableUSDPrice = async (currencyAddress: string, timestamp: number) => {
    // At the moment, we support day-level granularity for prices
    // const DAY = 24 * 3600;

    // const normalizedTimestamp = Math.floor(timestamp / DAY);
    // const key = `${currencyAddress}-${normalizedTimestamp}`.toLowerCase();
    // if (!USD_PRICE_MEMORY_CACHE.has(key)) {
    //   // If the price is not available in the memory cache, use any available database cached price
    //   let cachedPrice = await getCachedUSDPrice(currencyAddress, timestamp);
    //   if (
    //     // If the database cached price is not available
    //     !cachedPrice ||
    //     // Or if the database cached price is stale (older than what is requested)
    //     Math.floor(cachedPrice.timestamp / DAY) !== normalizedTimestamp
    //   ) {
    // Then try to fetch the price from upstream
    const upstreamPrice = await this.getUpstreamUSDPrice(
      currencyAddress,
      timestamp,
    );
    //   if (upstreamPrice) {
    //     cachedPrice = upstreamPrice;
    //   }
    // }

    //   if (cachedPrice) {
    //     this.USD_PRICE_MEMORY_CACHE.set(key, cachedPrice);
    //   }
    // }

    return upstreamPrice;
    // return USD_PRICE_MEMORY_CACHE.get(key);
  };

  getUSDAndNativePrices = async (
    currencyAddress: string,
    price: string,
    timestamp: number,
    // options?: {
    //   onlyUSD?: boolean;
    // },
  ): Promise<USDAndNativePrices> => {
    let usdPrice: string | undefined;
    // let nativePrice: string | undefined;

    // Only try to get pricing data if the network supports it
    //TODO:need change these addresses usdc addresses on goerili testnet
    const force =
      this.chainId === 5 &&
      [
        '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        '0x68b7e050e6e2c7efe11439045c9d49813c1724b8',
      ].includes(currencyAddress);
    if (getNetworkSettings().coingecko?.networkId || force) {
      const currencyUSDPrice = await this.getAvailableUSDPrice(
        currencyAddress,
        timestamp,
      );

      // let nativeUSDPrice: Price | undefined;
      // if (!options?.onlyUSD) {
      //   nativeUSDPrice = await this.getAvailableUSDPrice(
      //     AddressZero,
      //     timestamp,
      //   );
      // }

      const currency = await this.getCurrencyDetails(currencyAddress);
      if (currency?.decimals && currencyUSDPrice) {
        const currencyUnit = bn(10).pow(currency?.decimals);
        usdPrice = bn(price)
          .mul(currencyUSDPrice.value)
          .div(currencyUnit)
          .toString();
        // if (nativeUSDPrice) {
        //   nativePrice = bn(price)
        //     .mul(currencyUSDPrice.value)
        //     .mul(this.NATIVE_UNIT)
        //     .div(nativeUSDPrice.value)
        //     .div(currencyUnit)
        //     .toString();
        // }
      }
    }

    //TODO: ADD BNB IN Addresses also weth equivalent for bnb
    // // Make sure to handle the case where the currency is the native one (or the wrapped equivalent)
    // if (
    //   [Addresses.Eth[this.chainId], Addresses.Weth[this.chainId]].includes(
    //     currencyAddress,
    //   )
    // ) {
    //   // nativePrice = price;
    // }

    return { usdPrice };
    // return { usdPrice, nativePrice };
  };
}
