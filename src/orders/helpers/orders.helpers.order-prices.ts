import { Interface } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { formatEther, formatUnits } from '@ethersproject/units';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { bigNumber } from 'src/common/utils.common';
import { getNetworkSettings } from 'src/config/network.config';
import { UsdPricesService } from 'src/usd-prices/usd-prices.service';
import * as Addresses from '../constants/orders.constants.addresses';
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
    private readonly usdPricesService: UsdPricesService,
  ) {}

  private readonly logger = new Logger('OrderPrices');
  chainId = this.rpcProvider.chainId;
  baseProvider = this.rpcProvider.baseProvider;

  USD_DECIMALS = 6;
  // TODO: This should be a per-network setting
  NATIVE_UNIT = bigNumber('1000000000000000000');

  getCurrencyDetails = async (currencyAddress: string) => {
    try {
      // `name`, `symbol` and `decimals` are fetched on-chain
      const iface = new Interface([
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ]);

      //for native coins eg; eth or bigNumberb we don't have contract address AddressZero
      // to avoid api failure for AddressZero replace it with space as per in api spec
      let name = '';
      let symbol = '';
      let decimals = '';

      if (currencyAddress !== AddressZero) {
        const contract = new Contract(
          currencyAddress,
          iface,
          this.baseProvider,
        );
        name = await contract.name();
        symbol = await contract.symbol();
        decimals = await contract.decimals();
      }
      const metadata: CurrencyMetadata = {};
      let result: {
        name?: string;
        id?: string;
        symbol?: string;
        image?: { large?: string };
      };

      const coingeckoNetworkId = getNetworkSettings().coingecko?.networkId;
      if (coingeckoNetworkId) {
        //TODO: CHANGE ETHEREUM IN URL TO BINANCECOIN
        const url = `https://api.coingecko.com/api/v3/coins/${coingeckoNetworkId}/contract/${
          currencyAddress === AddressZero ? '%20' : currencyAddress
        }`;

        console.log(url, 'url for the name symbol');

        const response = await lastValueFrom(this.httpService.get(url));
        result = response.data;
        if (result.id) {
          metadata.coingeckoCurrencyId = result.id;
        }
        if (result.image?.large) {
          metadata.image = result.image.large;
        }
      }

      return {
        name: name ? name : result.name,
        symbol: symbol ? symbol : result['symbol'],
        decimals: decimals ? decimals : '18',
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
        // console.log(day, 'day logged');

        //TODO : CHANGE THE ID FROM ETHEREUM TO BINANCECOIN
        const url = `https://api.coingecko.com/api/v3/coins/${coingeckoCurrencyId}/history?date=${day}-${month}-${year}`;
        this.logger.log('prices', `Fetching price from Coingecko: ${url}`);

        const response = await lastValueFrom(this.httpService.get(url));
        const result: {
          market_data: {
            current_price: { [symbol: string]: number };
          };
        } = response.data;

        // console.log(result, 'result logged out');

        const usdPrice = result?.market_data?.current_price?.['usd'];
        console.log(usdPrice, 'usd price');

        if (usdPrice) {
          // const value = parseUnits(
          //   usdPrice.toFixed(this.USD_DECIMALS),
          //   this.USD_DECIMALS,
          // ).toString();

          await this.usdPricesService.create({
            currency: currencyAddress,
            timestamp,
            // value,
            value: usdPrice.toString(),
          });

          return {
            currency: currencyAddress,
            timestamp: truncatedTimestamp,
            // value,
            value: usdPrice.toString(),
          };
        }
      } else if (
        getNetworkSettings().whitelistedCurrencies.has(currencyAddress)
      ) {
        //  Whitelisted currencies are 1:1 with USD
        const value = '1';

        await this.usdPricesService.create({
          currency: currencyAddress,
          timestamp,
          value,
        });

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

  getCachedUSDPrice = async (
    currencyAddress: string,
    timestamp: number,
  ): Promise<Price | undefined> => {
    try {
      const data = await this.usdPricesService.show({
        currency: currencyAddress,
        timestamp,
      });
      // console.log(data, 'cahced data', currencyAddress, timestamp);
      return data;
    } catch (error) {
      // console.log('failed getting cashedUsdPrice', error);
      return undefined;
    }
  };

  USD_PRICE_MEMORY_CACHE = new Map<string, Price>();
  getAvailableUSDPrice = async (currencyAddress: string, timestamp: number) => {
    // At the moment, we support day-level granularity for prices
    const DAY = 24 * 3600;

    const normalizedTimestamp = Math.floor(timestamp / DAY);
    const key = `${currencyAddress}-${normalizedTimestamp}`.toLowerCase();
    if (!this.USD_PRICE_MEMORY_CACHE.has(key)) {
      // If the price is not available in the memory cache, use any available database cached price
      let cachedPrice = await this.getCachedUSDPrice(
        currencyAddress,
        timestamp,
      );
      if (
        // If the database cached price is not available
        !cachedPrice ||
        // Or if the database cached price is stale (older than what is requested)
        Math.floor(cachedPrice.timestamp / DAY) !== normalizedTimestamp
      ) {
        // Then try to fetch the price from upstream
        const upstreamPrice = await this.getUpstreamUSDPrice(
          currencyAddress,
          timestamp,
        );
        if (upstreamPrice) {
          cachedPrice = upstreamPrice;
        }
      }

      if (cachedPrice) {
        this.USD_PRICE_MEMORY_CACHE.set(key, cachedPrice);
      }
    }

    return this.USD_PRICE_MEMORY_CACHE.get(key);
  };

  getUSDAndNativePrices = async (
    currencyAddress: string,
    price: string,
    timestamp: number,
    options?: {
      onlyUSD?: boolean;
    },
  ): Promise<USDAndNativePrices> => {
    let usdPrice: string | undefined;
    let nativePrice: string | undefined;

    // Only try to get pricing data if the network supports it
    //TODO:need change these addresses usdc addresses on goerili testnet
    const force =
      this.chainId === 1 &&
      [
        '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        '0x68b7e050e6e2c7efe11439045c9d49813c1724b8',
      ].includes(currencyAddress);
    if (getNetworkSettings().coingecko?.networkId || force) {
      const currencyUSDPrice = await this.getAvailableUSDPrice(
        currencyAddress,
        timestamp,
      );

      let nativeUSDPrice: Price | undefined;
      if (!options?.onlyUSD) {
        nativeUSDPrice = await this.getAvailableUSDPrice(
          AddressZero,
          timestamp,
        );
      }

      const currency = await this.getCurrencyDetails(currencyAddress);
      if (currency?.decimals && currencyUSDPrice) {
        usdPrice = (
          Number(formatUnits(price, currency.decimals)) *
          Number(currencyUSDPrice.value)
        ).toString();
        if (nativeUSDPrice) {
          nativePrice = formatUnits(price, currency.decimals).toString();
        }
      }
    }

    //TODO: ADD bigNumberB IN Addresses also weth equivalent for bigNumberb
    // // Make sure to handle the case where the currency is the native one (or the wrapped equivalent)
    if (
      [Addresses.Eth[this.chainId], Addresses.Weth[this.chainId]].includes(
        currencyAddress,
      )
    ) {
      nativePrice = formatEther(price).toString();
    }
    return { usdPrice, nativePrice };
  };
}
