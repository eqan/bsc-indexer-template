import { Result } from '@ethersproject/abi';
import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import {
  decodeAssetClass,
  decodeAssetData,
  decodeOrderData,
} from 'src/events/handlers/utils/events.utils.decode-order';
import { fillMatchFunctionType } from 'src/events/types/events.types';
import { ORDER_TYPES } from 'src/orders/constants/orders.constants.order-types';
import { CreateOrdersInput } from 'src/orders/dto/create-orders.input';
import { OrderStatus } from 'src/orders/entities/enums/orders.status.enum';
import { OrderPrices } from 'src/orders/helpers/orders.helpers.order-prices';
import { OrdersService } from 'src/orders/orders.service';
import { bn } from '../../../common/utils.common';
import {
  getPaymentCurrency,
  getPaymentCurrencyAssetName,
} from './events.utils.helpers.orders';

/**
 * StoreBuySellOrders parses the match event to
 * get buy and sell order and stores both orders
 * in order entity with onchian check true
 */

@Injectable()
export class StoreOnchainBuySellOrders {
  constructor(
    private readonly orderPrices: OrderPrices,
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
    newLeftFill,
    newRightFill,
  ) => {
    switch (fillType) {
      case 'directPurchase': {
        try {
          const dataType = result[0]['sellOrderDataType'];
          const data = result[0]['sellOrderData'];
          const decodeNftData = decodeAssetData(
            result[0]['nftAssetClass'],
            result[0]['nftData'],
          );
          console.log(decodeNftData, 'jo chahiyay');
          const value = decodeOrderData(dataType, data);
          console.log(value);
          const dbOrder: CreateOrdersInput = {
            orderId,
            fill: 1,
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            lastUpdatedAt: new Date(),
            maker: result[0]['sellOrderMaker'],
            signature: result[0]['sellOrderSignature'],
            start: Number(bn(result[0]['sellOrderStart'])),
            end: Number(bn(result[0]['sellOrderEnd'])),
            salt: bn(result[0]['sellOrderSalt']).toHexString(),
            //ERROR : DON'T KNOW THIS MAKESTOCK FIELD DUMMY WRONG DATA FILLED
            makeStock: 77, //will be the price at which order was placed
            make: {
              value: bn(result[0]['sellOrderNftAmount']).toString(),
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
            // taker,
            take: {
              value: newLeftFill,
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
          };
          const saved = await this.orderService.create(dbOrder);
          console.log('saved blaw blaw in db', saved);
        } catch (error) {
          // tx data doesn't match directPurchase
          console.log('failed saving blaw', error);
        }
      }
      // Try to parse calldata as directAcceptBid
      case 'directAcceptBid': {
        try {
          const dataType = result[0]['bidMaker'];
          const data = result[0]['bidDataType'];
          const dbOrder: CreateOrdersInput = {
            orderId,
            fill: 1,
            //INFO : FOR NOW order type is V2 for all orders this field will be removed once we shift to
            // binance
            type: ORDER_TYPES.V2,
            status: OrderStatus.Filled,
            cancelled: false,
            createdAt: new Date(timestamp * 1000),
            lastUpdatedAt: new Date(),
            maker: result[0]['bidMaker'],
            signature: result[0]['bidSignature'],
            start: Number(bn(result[0]['bidStart'])),
            end: Number(bn(result[0]['bidEnd'])),
            salt: bn(result[0]['sellOrderSalt']).toHexString(),
            //ERROR : DON'T KNOW THIS MAKESTOCK FIELD DUMMY WRONG DATA FILLED
            makeStock: 77, //will be the price at which order was placed
            make: {
              value: newLeftFill,
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
            // taker,
            take: {
              value: bn(result[0]['bidNftAmount']).toString(),
              assetType: decodeAssetData(
                result[0]['nftAssetClass'],
                result[0]['nftData'],
              ) as any,
            },
            // taker,
            data: decodeOrderData(dataType, data) as any,
          };
          const saved = await this.orderService.create(dbOrder);
          console.log('direct accept bid saved blaw blaw in db', saved);
        } catch {
          console.log('tx data doesnt match directAcceptBid');
          // tx data doesn't match directAcceptBid
        }
      }
      case 'match': {
        // Try to parse calldata as matchOrders
        try {
        } catch {
          console.log('tx data doesnt match matchOrders');
          // tx data doesn't match matchOrders
        }
      }
    }
  };
}
