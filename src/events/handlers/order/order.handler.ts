import { defaultAbiCoder } from '@ethersproject/abi';
import { Injectable, Logger } from '@nestjs/common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class OrderMatchHandler {
  constructor(private readonly ordersService: OrdersService) {}

  private readonly logger = new Logger('OrderMatchHandler');

  handleMatchOrder = async (events: EnhancedEvent) => {
    const { log, kind } = events;

    const eventData = getEventData([kind])[0];
    try {
      const { args } = eventData.abi.parseLog(log);
      console.log(args, 'argument logged');
      const leftHash = args['leftHash'].toLowerCase();
      const leftMaker = args['leftMaker'].toLowerCase();
      let taker = args['rightMaker'].toLowerCase();
      // const newLeftFill = args['newLeftFill'].toString();
      // const newRightFill = args['newRightFill'].toString();
      const leftAsset = args['leftAsset'];
      const rightAsset = args['rightAsset'];

      const ERC20 = '0x8ae85d84';
      const ETH = '0xaaaebeba';
      const ERC721 = '0x73ad2146';
      const ERC1155 = '0x973bb640';

      const assetTypes = [ERC721, ERC1155, ERC20, ETH];

      // Exclude orders with exotic asset types
      if (
        !assetTypes.includes(leftAsset.assetClass) ||
        !assetTypes.includes(rightAsset.assetClass)
      ) {
        return;
      }

      // Assume the left order is the maker's order
      const side = [ERC721, ERC1155].includes(leftAsset.assetClass)
        ? 'sell'
        : 'buy';

      // const currencyAsset = side === 'sell' ? rightAsset : leftAsset;
      const nftAsset = side === 'sell' ? leftAsset : rightAsset;

      // Handle: attribution

      const orderKind = eventData.kind.startsWith('universe')
        ? 'universe'
        : 'rarible';
      const data = { taker: '88' };
      // await syncEventsUtils.extractAttributionData(
      //   txHash,
      //   orderKind,
      // );
      if (data.taker) {
        taker = data.taker;
      }

      // Handle: prices

      // let currency: string;
      // if (currencyAsset.assetClass === ETH) {
      //   currency = Sdk.Common.Addresses.Eth[config.chainId];
      // } else if (currencyAsset.assetClass === ERC20) {
      //   const decodedCurrencyAsset = defaultAbiCoder.decode(
      //     ['(address token)'],
      //     currencyAsset.data,
      //   );
      //   currency = decodedCurrencyAsset[0][0];
      // } else {
      //   break;
      // }

      const decodedNftAsset = defaultAbiCoder.decode(
        ['(address token, uint tokenId)'],
        nftAsset.data,
      );

      const contract = decodedNftAsset[0][0].toLowerCase();
      const tokenId = decodedNftAsset[0][1].toString();

      // let currencyPrice = side === 'sell' ? newLeftFill : newRightFill;
      // const amount = side === 'sell' ? newRightFill : newLeftFill;
      // currencyPrice = bn(currencyPrice).div(amount).toString();

      // const prices = await getUSDAndNativePrices(
      //   currency.toLowerCase(),
      //   currencyPrice,
      //   timestamp,
      // );
      // if (!prices.nativePrice) {
      //   // We must always have the native price
      //   break;
      // }
      // const returnData = {
      //   orderKind,
      //   orderId: leftHash,
      //   orderSide: side,
      //   maker: leftMaker,
      //   taker,
      //   // price: prices.nativePrice,
      //   // currency,
      //   // currencyPrice,
      //   // usdPrice: prices.usdPrice,
      //   contract,
      //   tokenId,
      //   baseEventParams,
      //   // amount,
      //   // orderSourceId: data.orderSource?.id,
      //   // aggregatorSourceId: data.aggregatorSource?.id,
      //   // fillSourceId: data.fillSource?.id,
      //   // baseEventParams,
      // };
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
    } catch (error) {
      this.logger.error(`failed Cancelling Order ${error}`);
    }
  };
}
