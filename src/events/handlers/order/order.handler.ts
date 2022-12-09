import { defaultAbiCoder, Interface } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { getTxTrace, searchForCall } from '@georgeroman/evm-tx-simulator';
import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { Routers } from '../utils/utils.constants.order';
import { extractAttributionData } from '../utils/utils.order';

@Injectable()
export class OrderMatchHandler {
  constructor(
    // private readonly ordersService: OrdersService,
    private rpcProvider: RpcProvider,
  ) {
    // const res =
    //   Routers[1]?.['0x9757F2d2b135150BBeb65308D4a91804107cd8D6'.toLowerCase()];
    // console.log(res, 'logged res');
  }

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

      const ERC20 = '0x8ae85d84';
      const ETH = '0xaaaebeba';
      const ERC721 = '0x73ad2146';
      const ERC1155 = '0x973bb640';
      const COLLECTION = '0xf63c2825';

      const matchOrdersSigHash = '0xe99a3f80';
      const directPurchaseSigHash = '0x0d5f7d35';
      const directAcceptBidSigHash = '0x67d49a3b';

      const assetTypes = [ERC721, ERC1155, ERC20, ETH, COLLECTION];

      const orderKind = 'rarible';
      let side: 'sell' | 'buy' = 'sell';
      let taker = AddressZero;
      let currencyAssetType = '';
      let nftAssetType = '';
      let nftData = '';
      let maker = '';
      let paymentCurrency = '';
      let amount = '';
      let currencyPrice = '';
      let orderId = '';

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
            sigHashes: [directPurchaseSigHash],
          },
          eventRank,
        );
        if (callTrace) {
          const iface = new Interface([
            'function directPurchase(tuple(address sellOrderMaker, uint256 sellOrderNftAmount, bytes4 nftAssetClass, bytes nftData, uint256 sellOrderPaymentAmount, address paymentToken, uint256 sellOrderSalt, uint sellOrderStart, uint sellOrderEnd, bytes4 sellOrderDataType, bytes sellOrderData, bytes sellOrderSignature, uint256 buyOrderPaymentAmount, uint256 buyOrderNftAmount, bytes buyOrderData))',
          ]);
          const result = iface.decodeFunctionData(
            'directPurchase',
            callTrace.input,
          );
          orderId = leftHash;
          side = 'sell';
          maker = result[0][0].toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = callTrace.to.toLowerCase();
          nftAssetType = result[0][2];
          nftData = result[0][3];

          paymentCurrency = result[0][5].toLowerCase();
          if (paymentCurrency === AddressZero) {
            currencyAssetType = ETH;
          } else {
            currencyAssetType = ERC20;
          }

          currencyPrice = newLeftFill;
          amount = newRightFill;

          eventsLog.directPurchase.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
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
            sigHashes: [directAcceptBidSigHash],
          },
          eventRank,
        );

        if (callTrace) {
          const iface = new Interface([
            'function directAcceptBid(tuple(address bidMaker, uint256 bidNftAmount, bytes4 nftAssetClass, bytes nftData, uint256 bidPaymentAmount, address paymentToken, uint256 bidSalt, uint bidStart, uint bidEnd, bytes4 bidDataType, bytes bidData, bytes bidSignature, uint256 sellOrderPaymentAmount, uint256 sellOrderNftAmount, bytes sellOrderData) )',
          ]);
          const result = iface.decodeFunctionData(
            'directAcceptBid',
            callTrace.input,
          );
          orderId = rightHash;

          side = 'buy';
          maker = result[0][0].toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = callTrace.from.toLowerCase();
          nftAssetType = result[0][2];
          nftData = result[0][3];

          paymentCurrency = result[0][5].toLowerCase();
          if (paymentCurrency === AddressZero) {
            currencyAssetType = ETH;
          } else {
            currencyAssetType = ERC20;
          }

          currencyPrice = newLeftFill;
          amount = newRightFill;

          eventsLog.directAcceptBid.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
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
            sigHashes: [matchOrdersSigHash],
          },
          eventRank,
        );

        if (callTrace) {
          const iface = new Interface([
            'function matchOrders(tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) takeAsset, uint256 salt, uint256 start, uint256 end, bytes4 dataType, bytes data) orderLeft, bytes signatureLeft, tuple(address maker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) makeAsset, address taker, tuple(tuple(bytes4 assetClass, bytes data) assetType, uint256 value) takeAsset, uint256 salt, uint256 start, uint256 end, bytes4 dataType, bytes data) orderRight, bytes signatureRight)',
          ]);
          const result = iface.decodeFunctionData(
            'matchOrders',
            callTrace.input,
          );
          const orderLeft = result.orderLeft;
          const orderRight = result.orderRight;
          const leftMakeAsset = orderLeft.makeAsset;
          const rightMakeAsset = orderLeft.takeAsset;

          maker = orderLeft.maker.toLowerCase();
          // taker will be overwritten in extractAttributionData step if router is used
          taker = orderRight.maker.toLowerCase();
          side = [ERC721, ERC1155].includes(leftMakeAsset.assetType.assetClass)
            ? 'sell'
            : 'buy';

          const nftAsset = side === 'buy' ? rightMakeAsset : leftMakeAsset;
          const currencyAsset = side === 'buy' ? leftMakeAsset : rightMakeAsset;

          orderId = leftHash;
          nftAssetType = nftAsset.assetType.assetClass;
          currencyAssetType = currencyAsset.assetType.assetClass;
          switch (nftAssetType) {
            case COLLECTION:
              // Left order doesn't contain token id. We need to use the right order
              nftData = orderRight.makeAsset.assetType.data;
              break;
            case ERC721:
            case ERC1155:
              nftData = nftAsset.assetType.data;
              break;
            default:
              throw Error('Unsupported asset type');
          }

          if (currencyAssetType === ETH) {
            paymentCurrency = 'ETH';
          } else if (currencyAssetType === ERC20) {
            const decodedCurrencyAsset = defaultAbiCoder.decode(
              ['(address token)'],
              currencyAsset.assetType.data,
            );
            paymentCurrency = decodedCurrencyAsset[0][0].toLowerCase();
          }

          // Match order has amount in newLeftFill when it's a buy order and amount in newRightFill when it's sell order
          amount = side === 'buy' ? newLeftFill : newRightFill;
          currencyPrice = side === 'buy' ? newRightFill : newLeftFill;

          eventsLog.matchOrders.set(`${txHash}-${address}`, eventRank + 1);
        }
      } catch {
        // tx data doesn't match matchOrders
      }

      // Exclude orders with exotic asset types
      if (
        !assetTypes.includes(nftAssetType) ||
        !assetTypes.includes(currencyAssetType)
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

      const decodedNftAsset = defaultAbiCoder.decode(
        ['(address token, uint tokenId)'],
        nftData,
      );
      const contract = decodedNftAsset[0][0].toLowerCase();
      const tokenId = decodedNftAsset[0][1].toString();

      const data = {
        orderKind,
        orderId,
        orderSide: side,
        maker,
        taker,
        // price: prices.nativePrice,
        // currency,
        currencyPrice,
        // usdPrice: prices.usdPrice,
        contract,
        tokenId,
        amount,
        timestamp,
        txHash,
      };

      console.log(data, 'data logged out after listening event');
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

      const returnData = {
        orderKind: 'rarible',
        orderId,
        baseEventParams,
      };
      console.log(returnData, 'cancel event return data');
    } catch (error) {
      this.logger.error(`failed Cancelling Order ${error}`);
    }
  };
}
