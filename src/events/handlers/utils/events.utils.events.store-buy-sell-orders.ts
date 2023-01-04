import { Result } from '@ethersproject/abi';
import { formatEther } from '@ethersproject/units';
import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import {
  decodeAssetData,
  decodeOrderData,
} from 'src/events/handlers/utils/events.utils.decode-order';
import { fillMatchFunctionType } from 'src/events/types/events.types';
import { ORDER_TYPES } from 'src/orders/constants/orders.constants.order-types';
import { CreateOnchainOrdersInput } from 'src/orders/dto/create-onchain.orders.input';
import { OrderStatus } from 'src/orders/entities/enums/orders.status.enum';
import { OrdersService } from 'src/orders/orders.service';
import { bigNumber } from '../../../common/utils.common';
import {
  getOrderSide,
  getPaymentCurrency,
} from './events.utils.helpers.orders';

/**
 * StoreBuySellOrders parses the match event to
 * get buy and sell order and stores both orders
 * in order entity with onchian check true
 */

@Injectable()
export class StoreOnchainBuySellOrders {
  constructor(
    private readonly orderService: OrdersService,
    private rpcProvider: RpcProvider,
  ) {}
  chainId = this.rpcProvider.chainId;
  private readonly logger = new Logger('ParseOrder');

  handleStoreOrders = async (
    result: Result,
    fillType: fillMatchFunctionType,
    orderId: string,
    leftOrderId: string,
    rightOrderId: string,
    timestamp: number,
    taker: string,
    newLeftFill: string,
    newRightFill: string,
    usdPrice: string,
    price: string,
    contract: string,
    tokenId: string,
  ) => {
    switch (fillType) {
      case 'directPurchase': {
        try {
          const dataType = result[0]['sellOrderDataType'];
          const data = result[0]['sellOrderData'];
          const dbOrder: CreateOnchainOrdersInput = {
            orderId,
            fill: newRightFill,
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            onchain: true,
            side: OrderSide.sell,
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            maker: result[0]['sellOrderMaker'],
            signature: result[0]['sellOrderSignature'],
            start: Number(bigNumber(result[0]['sellOrderStart'])),
            end: Number(bigNumber(result[0]['sellOrderEnd'])),
            salt: bigNumber(result[0]['sellOrderSalt']).toHexString(),
            makePrice: Number(price),
            makePriceUsd: Number(usdPrice),
            makeStock: (
              Number(bigNumber(result[0]['sellOrderNftAmount'])) -
              Number(newRightFill)
            ).toString(), //will be the price at which order was placed
            make: {
              value: bigNumber(result[0]['sellOrderNftAmount']).toString(),
              assetType: decodeAssetData(
                result[0]['nftAssetClass'],
                result[0]['nftData'],
              ) as any,
            },
            taker,
            take: {
              value: formatEther(result[0]['sellOrderPaymentAmount']),
              assetType: decodeAssetData(
                getPaymentCurrency(result[0]['paymentToken']),
                result[0]['paymentToken'],
              ) as any,
            },
            data: decodeOrderData(dataType, data) as any,
            contract,
            tokenId,
          };
          await this.orderService.createOnchainOrder(dbOrder);
          break;
        } catch (error) {
          this.logger.log(`tx data doesn't match directPurchase`);
        }
      }
      // Try to parse calldata as directAcceptBid
      case 'directAcceptBid': {
        try {
          const dataType = result[0]['bidMaker'];
          const data = result[0]['bidDataType'];
          const dbOrder: CreateOnchainOrdersInput = {
            orderId,
            fill: newRightFill,
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            onchain: true,
            side: OrderSide.buy,
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            maker: result[0]['bidMaker'],
            takePrice: Number(price),
            takePriceUsd: Number(usdPrice),
            signature: result[0]['bidSignature'],
            start: Number(bigNumber(result[0]['bidStart'])),
            end: Number(bigNumber(result[0]['bidEnd'])),
            salt: bigNumber(result[0]['sellOrderSalt']).toHexString(),
            makeStock: (
              Number(bigNumber(result[0]['bidNftAmount'])) -
              Number(newRightFill)
            ).toString(), //will be the price at which order was placed
            make: {
              value: formatEther(result[0]['bidPaymentAmount']),
              assetType: decodeAssetData(
                getPaymentCurrency(result[0]['paymentToken']),
                result[0]['paymentToken'],
              ) as any,
            },
            taker,
            take: {
              value: bigNumber(result[0]['bidNftAmount']).toString(),
              assetType: decodeAssetData(
                result[0]['nftAssetClass'],
                result[0]['nftData'],
              ) as any,
            },
            data: decodeOrderData(dataType, data) as any,
            contract,
            tokenId,
          };
          await this.orderService.createOnchainOrder(dbOrder);
          break;
        } catch {
          this.logger.log('tx data doesnt match directAcceptBid');
        }
      }
      case 'match': {
        // Try to parse calldata as matchOrders
        try {
          const orderLeft = result.orderLeft;
          const orderRight = result.orderRight;
          const leftMakeAsset = orderLeft.makeAsset;
          const rightMakeAsset = orderRight.makeAsset;
          const sideLeft = getOrderSide(leftMakeAsset.assetType.assetClass);
          const fill = sideLeft === OrderSide.buy ? newLeftFill : newRightFill;
          const makeStock =
            sideLeft === OrderSide.sell
              ? Number(bigNumber(orderLeft.makeAsset.value).toString()) -
                Number(fill)
              : Number(bigNumber(orderLeft.takeAsset.value).toString()) -
                Number(fill);

          const Left: CreateOnchainOrdersInput = {
            orderId: leftOrderId,
            side: sideLeft,
            fill,
            cancelled: false,
            status: OrderStatus.Filled,
            onchain: true,
            type: ORDER_TYPES.V2,
            makeStock: makeStock.toString(),
            maker: orderLeft.maker,
            taker,
            createdAt: new Date(timestamp * 1000),
            start: Number(bigNumber(orderLeft.start)),
            end: Number(bigNumber(orderLeft.end)),
            salt: bigNumber(orderLeft.salt).toHexString(),
            signature: result.signatureLeft,
            data: decodeOrderData(orderLeft.dataType, orderLeft.data) as any,
            make: {
              value:
                sideLeft === OrderSide.buy
                  ? formatEther(orderLeft.makeAsset.value)
                  : bigNumber(orderLeft.makeAsset.value).toString(),
              assetType: decodeAssetData(
                orderLeft.makeAsset.assetType.assetClass,
                orderLeft.makeAsset.assetType.data,
              ) as any,
            },
            take: {
              value:
                sideLeft === OrderSide.buy
                  ? bigNumber(orderLeft.takeAsset.value).toString()
                  : formatEther(orderLeft.takeAsset.value),
              assetType: decodeAssetData(
                orderLeft.takeAsset.assetType.assetClass,
                orderLeft.takeAsset.assetType.data,
              ) as any,
            },
            contract,
            tokenId,
          };

          if (Left.side === OrderSide.sell) {
            Left.makePrice = Number(price);
            Left.makePriceUsd = Number(usdPrice);
          } else {
            Left.takePrice = Number(price);
            Left.takePriceUsd = Number(usdPrice);
          }
          const Right: CreateOnchainOrdersInput = {
            orderId: rightOrderId,
            fill: '1',
            cancelled: false,
            status: OrderStatus.Filled,
            onchain: true,
            type: ORDER_TYPES.V2,
            makeStock: bigNumber(orderRight.makeAsset.value).toString(),
            side: getOrderSide(rightMakeAsset.assetType.assetClass),
            maker: orderRight.maker,
            taker: orderRight.taker,
            createdAt: new Date(timestamp * 1000),
            start: Number(bigNumber(orderRight.start)),
            end: Number(bigNumber(orderRight.end)),
            salt: bigNumber(orderRight.salt).toHexString(),
            signature: result.signatureRight,
            data: decodeOrderData(orderRight.dataType, orderRight.data) as any,
            make: {
              value: bigNumber(orderRight.makeAsset.value).toString(),
              assetType: decodeAssetData(
                orderRight.makeAsset.assetType.assetClass,
                orderRight.makeAsset.assetType.data,
              ),
            } as any,
            take: {
              value: bigNumber(orderRight.takeAsset.value).toString(),
              assetType: decodeAssetData(
                orderRight.takeAsset.assetType.assetClass,
                orderRight.takeAsset.assetType.data,
              ),
            } as any,
            contract,
            tokenId,
          };
          const orders = [Left, Right];
          for (const order of orders) {
            const response = await this.orderService.createOnchainOrder(order);
            console.log(response, 'left and right order');
          }
        } catch {
          this.logger.log('tx data doesnt match matchOrders');
        }
      }
    }
  };
}
