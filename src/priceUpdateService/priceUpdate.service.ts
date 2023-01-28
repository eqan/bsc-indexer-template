import { Injectable, Logger } from '@nestjs/common';
import bigDecimal from 'js-big-decimal';
import {
  AssetType,
  AssetTypeEnum,
  OrderFormAsset,
} from 'src/orders/dto/nestedObjectsDto/asset.dto';
import { OrderFormDto } from 'src/orders/dto/order-form.dto';
import { OrderTransaction } from 'src/orders/entities/enums/order.transaction-type.enum';
import { OrderTransactionAsset } from './dto/order-price-usd.dto';
import { normalize } from './priceNormalizer';
import { OrderPrices } from 'src/orders/helpers/orders.helpers.order-prices';

@Injectable()
export class PriceUpdateService {
  private readonly blockchain = 'Ethereum';
  private readonly logger = new Logger('price-update-service');
  private readonly orderPrices: OrderPrices;

  async withUpdatedUsdPrices(order: OrderFormDto): Promise<OrderFormDto> {
    const usdValue = await this.getAssetsUsdValue(order.make, order.take);
    console.log(usdValue);
    if (!usdValue) {
      return order;
    }
    return { ...order, ...usdValue };
  }
  async getAssetsUsdValue(
    make: OrderFormAsset,
    take: OrderFormAsset,
  ): Promise<OrderTransactionAsset | null> {
    const normalizedMake = await normalize(make);
    const normalizedTake = await normalize(take);
    console.log(normalizedMake);
    if (make.assetType.assetClass == AssetTypeEnum.ERC20) {
      const usdRate = await this.getAssetPrice(take.assetType);
      if (!usdRate) {
        return null;
      }
      const takePriceUsd = this.usdValue(usdRate, normalizedTake);
      const makePriceUsd = this.usdPrice(
        usdRate,
        normalizedMake,
        normalizedTake,
      );
      return {
        type: OrderTransaction.SELL_ORDER,
        makePriceUsd,
        takePriceUsd,
      };
    } else if (take.assetType.assetClass == AssetTypeEnum.ERC20) {
      const usdRate = await this.getAssetPrice(make.assetType);
      if (!usdRate) {
        return null;
      }
      const makePriceUsd = this.usdValue(usdRate, normalizedMake);
      const takePriceUsd = this.usdPrice(
        usdRate,
        normalizedTake,
        normalizedMake,
      );

      return {
        type: OrderTransaction.BID_ORDER,
        makePriceUsd,
        takePriceUsd,
      };
    } else {
      return null;
    }
  }
  async getAssetPrice(asset: AssetType): Promise<number | null> {
    const address = this.getAssetType(asset);
    if (!address) {
      return null;
    }
    return this.getTokenRate(address);
  }

  private getAssetType(asset: AssetType): string | null {
    if (asset.assetClass === AssetTypeEnum.ERC20) {
      return asset.contract;
    } else if (asset.assetClass === AssetTypeEnum.ETH) {
      return '0x0000000000000000000000000000000000000000';
    } else {
      return null;
    }
  }
  async getTokenRate(token: string): Promise<number | null> {
    let rate: number | null;
    try {
      rate = await this.orderPrices.getTokenPrice(token);
      console.log('This is: ', rate);
    } catch (e) {
      this.logger.warn(
        `Currency api didn't respond any value for ${this.blockchain}: ${token}`,
      );
      return null;
    }
    if (!rate) {
      this.logger.warn(
        `Currency api didn't respond any value for ${this.blockchain}: ${token}`,
      );
      return null;
    }
    return rate;
  }

  private usdValue(usdRate: number, payingPart: number): number {
    return usdRate * payingPart;
  }
  private usdPrice(
    usdRate: number,
    nftPart: number,
    payingPart: number,
  ): number {
    if (nftPart == 0) {
      return Number(new bigDecimal('0'));
    }
    return (usdRate * payingPart) / nftPart;
  }
}
