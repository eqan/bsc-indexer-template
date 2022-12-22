import { Result } from '@ethersproject/abi';
import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { fillMatchFunctionType } from 'src/events/types/events.types';
import { OrderKind } from 'src/graphqlFile';
import { ORDER_TYPES } from 'src/orders/constants/orders.constants.order-types';
import { CreateOrdersInput } from 'src/orders/dto/create-orders.input';
import { OrderStatus } from 'src/orders/entities/enums/orders.status.enum';
import { decodeOrderData } from 'src/events/handlers/utils/events.utils.decode-order';
import { OrderPrices } from 'src/orders/helpers/orders.helpers.order-prices';
import { OrdersService } from 'src/orders/orders.service';
import { bn } from '../../../common/utils.common';

/**
 * StoreBuySellOrders parses the match event to
 * get buy and sell order and stores both orders
 * in order entity with onchian check true
 */

@Injectable()
export class StoreBuySellOrders {
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
  ) => {
    switch (fillType) {
      case 'directPurchase': {
        try {
          const dataType = result[0]['sellOrderDataType'];
          const data = result[0]['sellOrderData'];
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
            taker,
            signature: result[0]['sellOrderSignature'],
            start: Number(bn(result[0]['sellOrderStart'])),
            end: Number(bn(result[0]['sellOrderEnd'])),
            salt: bn(result[0]['sellOrderSalt']).toString(),
            //ERROR : DON'T KNOW THIS MAKESTOCK FIELD DUMMY WRONG DATA FILLED
            makeStock: 77,
            make:{
              
            }

            }
            data: decodeOrderData(dataType, data),
          };
        } catch {
          // tx data doesn't match directPurchase
        }
      }
      // Try to parse calldata as directAcceptBid
      case 'directAcceptBid': {
        try {
          const hello = '';
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
