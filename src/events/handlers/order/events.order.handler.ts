import { defaultAbiCoder, Interface, Result } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { getTxTrace, searchForCall } from '@georgeroman/evm-tx-simulator';
import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { bn } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { OrderMatchEventInput } from 'src/events/dto/events.dto.order-match-events';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { OrderCancelEventService } from 'src/events/service/events.service.order-cancel-events';
import { OrderMatchEventService } from 'src/events/service/events.service.order-match-events';
import {
  EnhancedEvent,
  fillMatchFunctionType,
} from 'src/events/types/events.types';
import { OrderStatus } from 'src/orders/entities/enums/orders.status.enum';
import { OrderPrices } from 'src/orders/helpers/orders.helpers.order-prices';
import { OrdersService } from 'src/orders/orders.service';
import * as Addresses from '../../../orders/constants/orders.constants.addresses';
import * as constants from '../utils/events.utils.constants.order';
import { StoreOnchainBuySellOrders } from '../utils/events.utils.events.store-buy-sell-orders';
import {
  extractAttributionData,
  getPaymentCurrency,
} from '../utils/events.utils.helpers.orders';

@Injectable()
export class OrderMatchHandler {
  constructor(
    private readonly orderPrices: OrderPrices,
    private readonly orderMatchEventService: OrderMatchEventService,
    private readonly orderCancelEventService: OrderCancelEventService,
    private rpcProvider: RpcProvider,
    private storeOnchainBuySellOrders: StoreOnchainBuySellOrders,
    private readonly orderService: OrdersService,
  ) {
    // console.log(decodeOrderDataType('0x1b18cdf6')[0][1], 'encoded dataType');
    // console.log(formatEther(3000000000000000));
  }
  chainId = this.rpcProvider.chainId;
  private readonly logger = new Logger('OrderMatchHandler');

  handleMatchOrder = async (events: EnhancedEvent) => {
    const {
      log,
      kind,
      baseEventParams: { txHash, address, timestamp },
    } = events;

    const eventData = getEventData([kind])[0];
    try {
      // Keep track of all events within the currently processing transaction
      // let currentTx: string | undefined;
      // const currentTxLogs: Log[] = [];
      const eventsLog = {
        matchOrders: new Map<string, number>(),
        directPurchase: new Map<string, number>(),
        directAcceptBid: new Map<string, number>(),
      };

      const { args } = eventData.abi.parseLog(log);
      const leftHash = args['leftHash'].toLowerCase();
      const rightHash = args['rightHash'].toLowerCase();
      const newLeftFill = args['newLeftFill'].toString();
      const newRightFill = args['newRightFill'].toString();

      let result: Result;
      let side: OrderSide = OrderSide.sell;
      let taker = AddressZero;
      let currencyAssetType = '';
      let nftAssetType = '';
      let nftData = '';
      let maker = '';
      let paymentCurrency = '';
      let amount = '';
      let currencyPrice = '';
      let orderId = '';
      let fillType: fillMatchFunctionType = 'directPurchase';

      // Event data doesn't include full order information so we have to parse the calldata
      const txTrace = await getTxTrace(
        { hash: txHash },
        this.rpcProvider.baseProvider,
      );

      if (!txTrace) {
        // Skip any failed attempts to get the trace
        return;
      }

      // Rarible has 3 fill functions: directPurchase, directAcceptBid and matchOrders.
      // Try to parse calldata as directPurchase

      try {
        const eventRank =
          eventsLog.directPurchase.get(`${txHash}-${address}`) ?? 0;

        const callTrace = searchForCall(
          txTrace,
          {
            to: address,
            type: 'CALL',
            sigHashes: [constants.directPurchaseSigHash],
          },
          eventRank,
        );
        if (callTrace) {
          const iface = new Interface([
            'function directPurchase(tuple(address sellOrderMaker, uint256 sellOrderNftAmount, bytes4 nftAssetClass, bytes nftData, uint256 sellOrderPaymentAmount, address paymentToken, uint256 sellOrderSalt, uint sellOrderStart, uint sellOrderEnd, bytes4 sellOrderDataType, bytes sellOrderData, bytes sellOrderSignature, uint256 buyOrderPaymentAmount, uint256 buyOrderNftAmount, bytes buyOrderData))',
          ]);
          result = iface.decodeFunctionData('directPurchase', callTrace.input);
          // console.log(result, 'result in directpur');

          orderId = leftHash;
          side = OrderSide.sell;
          maker = result[0][0].toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = callTrace.to.toLowerCase();
          nftAssetType = result[0][2];
          nftData = result[0][3];
          fillType = 'directPurchase';

          paymentCurrency = result[0][5].toLowerCase();
          currencyAssetType = getPaymentCurrency(paymentCurrency);

          // if (paymentCurrency === AddressZero) {
          //   paymentCurrency = constants.ETH;
          // } else {
          //   currencyAssetType = constants.ERC20;
          // }

          currencyPrice = newLeftFill;
          amount = newRightFill;

          eventsLog.directPurchase.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
        console.log('tx data doesnt match directPurchase');
        // tx data doesn't match directPurchase
      }

      // Try to parse calldata as directAcceptBid
      try {
        const eventRank =
          eventsLog.directAcceptBid.get(`${txHash}-${address}`) ?? 0;

        const callTrace = searchForCall(
          txTrace,
          {
            to: address,
            type: 'CALL',
            sigHashes: [constants.directAcceptBidSigHash],
          },
          eventRank,
        );

        if (callTrace) {
          const iface = new Interface([
            'function directAcceptBid(tuple(address bidMaker, uint256 bidNftAmount, bytes4 nftAssetClass, bytes nftData, uint256 bidPaymentAmount, address paymentToken, uint256 bidSalt, uint bidStart, uint bidEnd, bytes4 bidDataType, bytes bidData, bytes bidSignature, uint256 sellOrderPaymentAmount, uint256 sellOrderNftAmount, bytes sellOrderData) )',
          ]);
          result = iface.decodeFunctionData('directAcceptBid', callTrace.input);
          console.log(result, 'logged result dirBid');
          orderId = rightHash;

          side = OrderSide.buy;
          maker = result[0][0].toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = callTrace.from.toLowerCase();
          nftAssetType = result[0][2];
          nftData = result[0][3];
          fillType = 'directAcceptBid';

          paymentCurrency = result[0][5].toLowerCase();
          currencyAssetType = getPaymentCurrency(paymentCurrency);

          currencyPrice = newLeftFill;
          amount = newRightFill;

          eventsLog.directAcceptBid.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
        console.log('tx data doesnt match directAcceptBid');
        // tx data doesn't match directAcceptBid
      }

      // Try to parse calldata as matchOrders
      try {
        const eventRank =
          eventsLog.matchOrders.get(`${txHash}-${address}`) ?? 0;
        const callTrace = searchForCall(
          txTrace,
          {
            to: address,
            type: 'CALL',
            sigHashes: [constants.matchOrdersSigHash],
          },
          eventRank,
        );

        if (callTrace) {
          const iface = new Interface([
            'function matchOrders(tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) takeAsset, uint256 salt, uint256 start, uint256 end, bytes4 dataType, bytes data) orderLeft, bytes signatureLeft, tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) takeAsset, uint256 salt, uint256 start, uint256 end, bytes4 dataType, bytes data) orderRight, bytes signatureRight)',
          ]);
          result = iface.decodeFunctionData('matchOrders', callTrace.input);
          // console.log(result, 'logged result match');
          const orderLeft = result.orderLeft;
          const orderRight = result.orderRight;
          const leftMakeAsset = orderLeft.makeAsset;
          const rightMakeAsset = orderLeft.takeAsset;

          maker = orderLeft.maker.toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = orderRight.maker.toLowerCase();
          side = [constants.ERC721, constants.ERC1155].includes(
            leftMakeAsset.assetType.assetClass,
          )
            ? OrderSide.sell
            : OrderSide.buy;
          fillType = 'match';

          const nftAsset =
            side === OrderSide.buy ? rightMakeAsset : leftMakeAsset;
          const currencyAsset =
            side === OrderSide.buy ? leftMakeAsset : rightMakeAsset;

          orderId = leftHash;
          nftAssetType = nftAsset.assetType.assetClass;
          currencyAssetType = currencyAsset.assetType.assetClass;
          switch (nftAssetType) {
            case constants.COLLECTION:
              // Left order doesn't contain token id. We need to use the right order
              nftData = orderRight.makeAsset.assetType.data;
              break;
            case constants.ERC721:
            case constants.ERC1155:
              nftData = nftAsset.assetType.data;
              break;
            default:
              throw Error('Unsupported asset type');
          }

          if (currencyAssetType === constants.ETH) {
            paymentCurrency = 'ETH';
          } else if (currencyAssetType === constants.ERC20) {
            const decodedCurrencyAsset = defaultAbiCoder.decode(
              ['(address token)'],
              currencyAsset.assetType.data,
            );
            paymentCurrency = decodedCurrencyAsset[0][0].toLowerCase();
          }

          // Match order has amount in newLeftFill when it's a buy order and amount in newRightFill when it's sell order
          amount = side === OrderSide.buy ? newLeftFill : newRightFill;
          currencyPrice = side === OrderSide.buy ? newRightFill : newLeftFill;

          eventsLog.matchOrders.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
        console.log('tx data doesnt match matchOrders');
        // tx data doesn't match matchOrders
      }

      // Exclude orders with exotic asset types
      if (
        !constants.assetTypes.includes(nftAssetType) ||
        !constants.assetTypes.includes(currencyAssetType)
      ) {
        return;
      }

      // Handle: attribution;
      const attributionData = await extractAttributionData(
        txHash,
        this.rpcProvider.baseProvider,
      );
      // console.log(attributionData, 'hello attribution logged oout ');
      if (attributionData.taker) {
        // console.log(attributionData.taker, 'taker logged');
        taker = attributionData.taker;
      }

      //TODO:HANDLE ALL RETURN STATEMENTS CAREFULLY

      // Handle: prices
      let currency: string;
      if (currencyAssetType === constants.ETH) {
        currency = Addresses.Eth[this.chainId];
        console.log(currency, 'logged currency');
      } else if (currencyAssetType === constants.ERC20) {
        currency = paymentCurrency;
        // console.log(currency, paymentCurrency, 'logged currency and payment');
      } else {
        // break;
        return;
      }

      const decodedNftAsset = defaultAbiCoder.decode(
        ['(address token, uint tokenId)'],
        nftData,
      );
      const contract: string = decodedNftAsset[0][0].toLowerCase();
      const tokenId: string = decodedNftAsset[0][1].toString();

      currencyPrice = bn(currencyPrice).div(amount).toString();

      const prices = await this.orderPrices.getUSDAndNativePrices(
        currency.toLowerCase(),
        currencyPrice,
        timestamp,
      );
      if (!prices.nativePrice) {
        // We must always have the native price
        return;
      }

      const matchEvent: OrderMatchEventInput = {
        orderId,
        orderSide: side,
        maker,
        taker,
        price: prices.nativePrice,
        currency,
        currencyPrice,
        usdPrice: prices.usdPrice,
        contract,
        tokenId,
        amount,
        baseEventParams: events.baseEventParams,
      };

      await this.orderMatchEventService.create(matchEvent);
      // console.log(savedEvent, 'saved event in event db');

      this.storeOnchainBuySellOrders.handleStoreOrders(
        result,
        fillType,
        orderId,
        leftHash,
        rightHash,
        events.baseEventParams.timestamp,
        taker,
        newLeftFill,
        newRightFill,
        prices.usdPrice,
      );

      /**
       * checking if order exists locally or not if it exists
       * update it otherwise create a new order locally
       */

      // const response = {
      //   orderKind,
      //   orderId,
      //   //TODO: RECHECK FILL
      //   fill: 1,
      //   nftAssetType,
      //   nftData,
      //   orderSide: side,
      //   maker,
      //   taker,
      //   price: prices.nativePrice,
      //   currency,
      //   currencyPrice,
      //   usdPrice: prices.usdPrice,
      //   contract,
      //   salt: bn(salt).toString(),
      //   start: bn(start).toString(),
      //   end: bn(end).toString(),
      //   dataType,
      //   data: decodeOrderData(dataType, data),
      //   tokenId,
      //   amount,
      //   timestamp,
      //   txHash,
      // };

      // console.log(response, 'data logged out after listening event');
    } catch (error) {
      this.logger.error(`failed Matching Order ${error}`);
    }
  };
  handleCancelOrder = async (events: EnhancedEvent) => {
    const { baseEventParams, log, kind } = events;

    const eventData = getEventData([kind])[0];
    try {
      const { args } = eventData.abi.parseLog(log);
      const orderId = args['hash'].toLowerCase();

      const cancelEvent = {
        orderKind: 'rarible',
        orderId,
        baseEventParams,
      };

      await this.orderCancelEventService.create(cancelEvent);
      // console.log(savedEvent, 'saved cancel event in event db');

      //updating order in db
      const order = await this.orderService.orderExistOrNot(
        cancelEvent.orderId,
      );
      if (order)
        await this.orderService.update({
          ...order,
          status: OrderStatus.Cancelled,
          cancelled: true,
        });
    } catch (error) {
      this.logger.error(`failed Cancelling Order ${error}`);
    }
  };
}
