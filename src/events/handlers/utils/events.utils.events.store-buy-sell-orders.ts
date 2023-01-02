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
import { OrderPrices } from 'src/orders/helpers/orders.helpers.order-prices';
import { OrdersService } from 'src/orders/orders.service';
import { bn } from '../../../common/utils.common';
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
  ) {
    // console.log(bn(parseEther('0.0000000000000001')).toString(), 'etherParsed');
  }
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
        // console.log(newRightFill, 'rightfill');
        // console.log(newLeftFill, 'leftfill');
        // console.log(timestamp);
        try {
          const dataType = result[0]['sellOrderDataType'];
          const data = result[0]['sellOrderData'];
          // const nftAmount = newRightFill;
          const dbOrder: CreateOnchainOrdersInput = {
            orderId,
            fill: newRightFill,
            // fill: formatEther(newLeftFill),
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            onchain: true,
            side: OrderSide.sell,
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            // lastUpdatedAt: new Date(),
            // dbUpdatedAt: new Date(),
            maker: result[0]['sellOrderMaker'],
            signature: result[0]['sellOrderSignature'],
            start: Number(bn(result[0]['sellOrderStart'])),
            end: Number(bn(result[0]['sellOrderEnd'])),
            salt: bn(result[0]['sellOrderSalt']).toHexString(),
            // makePrice: Number(bn(result[0]['sellOrderPaymentAmount'])),
            makePrice: Number(price),
            makePriceUsd: Number(usdPrice),
            makeStock: (
              Number(bn(result[0]['sellOrderNftAmount'])) - Number(newRightFill)
            ).toString(), //will be the price at which order was placed
            make: {
              // value: bn(result[0]['sellOrderNftAmount']).toString(),
              value: bn(result[0]['sellOrderNftAmount']).toString(),
              // value: price,
              // assetType: {
              //   assetClass: decodeAssetClass(result[0]['nftAssetClass']),
              //   contract: decodeNftData[0][0].toString(),
              //   tokenId: decodeNftData[0][1].toString(),
              // } as any,
              assetType: decodeAssetData(
                result[0]['nftAssetClass'],
                result[0]['nftData'],
              ) as any,
            },
            taker,
            take: {
              // value: formatEther(newLeftFill),
              value: formatEther(result[0]['sellOrderPaymentAmount']),
              // value: (Number(price) * Number(nftAmount)).toString(),
              // assetType: {
              //   assetClass: getPaymentCurrencyAssetName(
              //     result[0]['paymentToken'],
              //   ),
              //   contract: result[0]['paymentToken'],
              // } as any,
              assetType: decodeAssetData(
                getPaymentCurrency(result[0]['paymentToken']),
                result[0]['paymentToken'],
              ) as any,
            },
            data: decodeOrderData(dataType, data) as any,
            contract,
            tokenId,
          };
          // (dbOrder.make.assetType?.assetClass as any) === AssetClassEnum.ERC1155;
          const saved = await this.orderService.createOnchainOrder(dbOrder);
          console.log('saved directPurchase in db', saved);
          break;
        } catch (error) {
          // tx data doesn't match directPurchase
          console.log('failed saving directPurchase', error);
        }
      }
      // Try to parse calldata as directAcceptBid
      case 'directAcceptBid': {
        try {
          const dataType = result[0]['bidMaker'];
          const data = result[0]['bidDataType'];
          // const nftAmount = newRightFill;
          const dbOrder: CreateOnchainOrdersInput = {
            orderId,
            fill: newRightFill,
            // fill: formatEther(newLeftFill),
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            onchain: true,
            side: OrderSide.buy,
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            // lastUpdatedAt: new Date(),
            // dbUpdatedAt: new Date(),
            maker: result[0]['bidMaker'],
            // takePrice: Number(bn(result[0]['bidPaymentAmount'])),
            takePrice: Number(price),
            takePriceUsd: Number(usdPrice),
            signature: result[0]['bidSignature'],
            start: Number(bn(result[0]['bidStart'])),
            end: Number(bn(result[0]['bidEnd'])),
            salt: bn(result[0]['sellOrderSalt']).toHexString(),
            makeStock: (
              Number(bn(result[0]['bidNftAmount'])) - Number(newRightFill)
            ).toString(), //will be the price at which order was placed
            // makeStock: newLeftFill.toString(), //will be the price at which order was placed
            make: {
              // value: formatEther(newLeftFill),
              value: formatEther(result[0]['bidPaymentAmount']),
              // value: (Number(price) * Number(nftAmount)).toString(),
              // assetType: {
              //   assetClass: getPaymentCurrencyAssetName(
              //     result[0]['paymentToken'],
              //   ),
              //   contract: result[0]['paymentToken'],
              // } as any,
              assetType: decodeAssetData(
                getPaymentCurrency(result[0]['paymentToken']),
                result[0]['paymentToken'],
              ) as any,
              // assetType: decodeAssetData(
              //   getPaymentCurrency(result[0]['paymentToken']),
              //   result[0]['paymentToken'],
              // ) as any,
            },
            taker,
            take: {
              value: bn(result[0]['bidNftAmount']).toString(),
              assetType: decodeAssetData(
                result[0]['nftAssetClass'],
                result[0]['nftData'],
              ) as any,
            },
            data: decodeOrderData(dataType, data) as any,
            contract,
            tokenId,
          };
          const saved = await this.orderService.createOnchainOrder(dbOrder);
          console.log('direct accept bid in db', saved);
          break;
        } catch {
          console.log('tx data doesnt match directAcceptBid');
          // tx data doesn't match directAcceptBid
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

          // const nftAmount =
          //   sideLeft === OrderSide.buy ? newLeftFill : newRightFill;
          // const price = sideLeft === OrderSide.buy ? newRightFill : newLeftFill;
          const fill = sideLeft === OrderSide.buy ? newLeftFill : newRightFill;
          const makeStock =
            sideLeft === OrderSide.sell
              ? Number(bn(orderLeft.makeAsset.value).toString()) - Number(fill)
              : Number(bn(orderLeft.takeAsset.value).toString()) - Number(fill);

          const Left: CreateOnchainOrdersInput = {
            orderId: leftOrderId,
            side: sideLeft,
            // fill:
            //   sideLeft === OrderSide.buy
            //     ? formatEther(newLeftFill)
            //     : formatEther(newRightFill),
            fill,
            cancelled: false,
            status: OrderStatus.Filled,
            onchain: true,
            type: ORDER_TYPES.V2,
            // makeStock: bn(orderLeft.makeAsset.value).toString(),
            makeStock: makeStock.toString(),
            maker: orderLeft.maker,
            taker,
            createdAt: new Date(timestamp * 1000),
            start: Number(bn(orderLeft.start)),
            end: Number(bn(orderLeft.end)),
            salt: bn(orderLeft.salt).toHexString(),
            signature: result.signatureLeft,
            data: decodeOrderData(orderLeft.dataType, orderLeft.data) as any,
            make: {
              // value: bn(orderLeft.makeAsset.value).toString(),
              value:
                sideLeft === OrderSide.buy
                  ? formatEther(orderLeft.makeAsset.value)
                  : bn(orderLeft.makeAsset.value).toString(),
              //     mount in newRightFill when it's sell order
              // amount = side === OrderSide.buy ? newLeftFill : newRightFill;
              // currencyPrice = side === OrderSide.buy ? newRightFill : newLeftFill;
              // value:
              //   sideLeft === OrderSide.buy
              //     ? (Number(price) * Number(nftAmount)).toString()
              //     : nftAmount,
              assetType: decodeAssetData(
                orderLeft.makeAsset.assetType.assetClass,
                orderLeft.makeAsset.assetType.data,
              ) as any,
            },
            take: {
              // value: bn(orderLeft.takeAsset.value).toString(),
              value:
                sideLeft === OrderSide.buy
                  ? bn(orderLeft.takeAsset.value).toString()
                  : formatEther(orderLeft.takeAsset.value),
              // value:
              //   sideLeft === OrderSide.buy
              //     ? nftAmount
              //     : (Number(price) * Number(nftAmount)).toString(),
              assetType: decodeAssetData(
                orderLeft.takeAsset.assetType.assetClass,
                orderLeft.takeAsset.assetType.data,
              ) as any,
            },
            contract,
            tokenId,
          };

          // const currencyPrice =
          //   sideLeft === OrderSide.buy ? newRightFill : newLeftFill;

          if (Left.side === OrderSide.sell) {
            // Left.makePrice = Number(Left.take.value);
            // Left.makePrice = Number(newLeftFill);
            Left.makePrice = Number(price);
            Left.makePriceUsd = Number(usdPrice);
          } else {
            // Left.takePrice = Number(Left.make.value);
            // Left.takePrice = Number(newRightFill);
            Left.takePrice = Number(price);
            Left.takePriceUsd = Number(usdPrice);
          }

          // console.log(Left, 'left order made');
          const Right: CreateOnchainOrdersInput = {
            orderId: rightOrderId,
            fill: '1',
            cancelled: false,
            status: OrderStatus.Filled,
            onchain: true,
            type: ORDER_TYPES.V2,
            makeStock: bn(orderRight.makeAsset.value).toString(),
            side: getOrderSide(rightMakeAsset.assetType.assetClass),
            maker: orderRight.maker,
            taker: orderRight.taker,
            createdAt: new Date(timestamp * 1000),
            // lastUpdatedAt: new Date(),
            // dbUpdatedAt: new Date(),
            start: Number(bn(orderRight.start)),
            end: Number(bn(orderRight.end)),
            salt: bn(orderRight.salt).toHexString(),
            signature: result.signatureRight,
            data: decodeOrderData(orderRight.dataType, orderRight.data) as any,
            make: {
              value: bn(orderRight.makeAsset.value).toString(),
              assetType: decodeAssetData(
                orderRight.makeAsset.assetType.assetClass,
                orderRight.makeAsset.assetType.data,
              ),
            } as any,
            take: {
              value: bn(orderRight.takeAsset.value).toString(),
              assetType: decodeAssetData(
                orderRight.takeAsset.assetType.assetClass,
                orderRight.takeAsset.assetType.data,
              ),
            } as any,
            contract,
            tokenId,
          };
          // console.log(Right, 'right order made');
          const orders = [Left, Right];
          for (const order of orders) {
            const response = await this.orderService.createOnchainOrder(order);
            console.log(response, 'left and right order');
          }
        } catch {
          console.log('tx data doesnt match matchOrders');
          // tx data doesn't match matchOrders
        }
      }
    }
  };
}
