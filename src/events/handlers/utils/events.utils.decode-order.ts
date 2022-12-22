import { defaultAbiCoder } from '@ethersproject/abi';
import { AssetClassEnum } from 'src/orders/entities/enums/orders.asset-class.enum';
import { ORDER_DATA_TYPES } from '../../../orders/constants/orders.constants.order-types';
import { encodeAssetClass } from '../../../orders/helpers/orders.helpers.encode-order';
import * as Types from '../../../orders/types/orders.types';

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

export const decodeAssetData = (
  assetType: Types.LocalAssetType,
  data: string,
) => {
  switch (assetType.assetClass) {
    case AssetClassEnum.ETH:
      return '0x';
    case AssetClassEnum.ERC20:
    case AssetClassEnum.COLLECTION:
      return defaultAbiCoder.decode(['address'], data);
    case AssetClassEnum.ERC721:
    case AssetClassEnum.ERC1155:
      return defaultAbiCoder.decode(['address', 'uint256'], data);
    case AssetClassEnum.ERC721_LAZY:
      return defaultAbiCoder.decode(
        [
          'address contract',
          'tuple(uint256 tokenId, string uri, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
        ],
        data,
      );
    case AssetClassEnum.ERC1155_LAZY:
      return defaultAbiCoder.decode(
        [
          'address contract',
          'tuple(uint256 tokenId, string uri, uint256 supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
        ],
        data,
      );
    default:
      throw Error('Unknown rarible asset data');
  }
};
