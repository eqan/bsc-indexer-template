import { defaultAbiCoder } from '@ethersproject/abi';
import { ORDER_DATA_TYPES } from '../constants/orders.constants.order-types';
import { encodeAssetClass } from './orders.helpers.encode-order';

export const decodeOrderData = (dataType: string, data: string) => {
  let decodeOrderData;
  // | Types.ILegacyOrderData
  // | Types.IV1OrderData
  // | Types.IV2OrderData
  // | Types.IV3OrderSellData
  // | Types.IV3OrderBuyData;

  switch (dataType) {
    case encodeAssetClass(ORDER_DATA_TYPES.V1):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V1):
      //   const v1Data = data as Types.IV1OrderData;

      decodeOrderData = defaultAbiCoder.decode(
        [
          'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees)',
        ],
        data,
      );
      break;

    case encodeAssetClass(ORDER_DATA_TYPES.V2):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V2):
      //   const v2Data = data as Types.IV2OrderData;
      //   const side = getOrderSide(
      //     order.make.assetType.assetClass,
      //     order.take.assetType.assetClass,
      //   );

      //   const isMakeFill = side === 'buy' ? 0 : 1;

      decodeOrderData = defaultAbiCoder.decode(
        [
          'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees, bool isMakeFill)',
        ],
        data,
      );
      break;
    case encodeAssetClass(ORDER_DATA_TYPES.V3_SELL):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V3_SELL):
      //   const v3SellData = order.data as Types.IV3OrderSellData;

      decodeOrderData = defaultAbiCoder.decode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'uint maxFeesBasePoint',
          'bytes32 marketplaceMarker',
        ],
        data,
      );

      break;
    case encodeAssetClass(ORDER_DATA_TYPES.V3_BUY):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V3_BUY):
      //   const v3BuyData = order.data as Types.IV3OrderBuyData;

      decodeOrderData = defaultAbiCoder.decode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'bytes32 marketplaceMarker',
        ],
        data,
      );
      break;
    default:
      throw Error('Unknown rarible order type');
  }
  return decodeOrderData;
};
