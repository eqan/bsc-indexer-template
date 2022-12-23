import { defaultAbiCoder } from '@ethersproject/abi';
import { AssetClassEnum } from 'src/orders/entities/enums/orders.asset-class.enum';
import { ORDER_DATA_TYPES } from '../../../orders/constants/orders.constants.order-types';
import { encodeAssetClass } from '../../../orders/helpers/orders.helpers.encode-order';
import * as constants from '../utils/events.utils.constants.order';
export const decodeOrderData = (dataType: string, data: string) => {
  let decodedOrderData;
  // | Types.ILegacyOrderData
  // | Types.IV1OrderData
  // | Types.IV2OrderData
  // | Types.IV3OrderSellData
  // | Types.IV3OrderBuyData;

  switch (dataType) {
    case encodeAssetClass(ORDER_DATA_TYPES.V1):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V1):
      //   const v1Data = data as Types.IV1OrderData;

      decodedOrderData = defaultAbiCoder.decode(
        [
          'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees)',
        ],
        data,
      );
      return {
        dataType: getDecodedOrderData(dataType)[0][1],
        payouts: decodedOrderData[0][0],
        originFees: decodedOrderData[0][1],
      };

    case encodeAssetClass(ORDER_DATA_TYPES.V2):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V2):
      decodedOrderData = defaultAbiCoder.decode(
        [
          'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees, bool isMakeFill)',
        ],
        data,
      );
      return {
        dataType: getDecodedOrderData(dataType)[0][1],
        payouts: decodedOrderData[0][0],
        originFees: decodedOrderData[0][1],
        isMakeFill: decodedOrderData[0][2],
      };
    case encodeAssetClass(ORDER_DATA_TYPES.V3_SELL):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V3_SELL):
      decodedOrderData = defaultAbiCoder.decode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'uint maxFeesBasePoint',
          'bytes32 marketplaceMarker',
        ],
        data,
      );

      return {
        dataType: getDecodedOrderData(dataType)[0][1],
        payouts: decodedOrderData[0][0],
        originFeeFirst: decodedOrderData[0][1],
        originFeeSecond: decodedOrderData[0][2],
        maxFeesBasePoint: decodedOrderData[0][3],
        marketplaceMarker: decodedOrderData[0][4],
      };
    case encodeAssetClass(ORDER_DATA_TYPES.V3_BUY):
    case encodeAssetClass(ORDER_DATA_TYPES.API_V3_BUY):
      //   const v3BuyData = order.data as Types.IV3OrderBuyData;

      decodedOrderData = defaultAbiCoder.decode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'bytes32 marketplaceMarker',
        ],
        data,
      );
      return {
        dataType: getDecodedOrderData(dataType)[0][1],
        payouts: decodedOrderData[0][0],
        originFeeFirst: decodedOrderData[0][1],
        originFeeSecond: decodedOrderData[0][2],
        marketplaceMarker: decodedOrderData[0][3],
      };
    default:
      throw Error('Unknown rarible order type');
  }
  // return decodedOrderData;
};

// export const encodeAssetData = (assetType: Types.LocalAssetType) => {
//   switch (assetType.assetClass) {
//     case AssetClassEnum.ETH:
//       return '0x';
//     case AssetClassEnum.ERC20:
//     case AssetClassEnum.COLLECTION:
//       return defaultAbiCoder.encode(['address'], [assetType.contract]);
//     case AssetClassEnum.ERC721:
//     case AssetClassEnum.ERC1155:
//       return defaultAbiCoder.encode(
//         ['address', 'uint256'],
//         [assetType.contract, assetType.tokenId],
//       );
//     case AssetClassEnum.ERC721_LAZY:
//       return defaultAbiCoder.encode(
//         [
//           'address contract',
//           'tuple(uint256 tokenId, string uri, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
//         ],
//         [
//           assetType.contract,
//           {
//             tokenId: assetType.tokenId,
//             uri: assetType.uri,
//             creators: encodeV2OrderData(assetType.creators),
//             royalties: encodeV2OrderData(assetType.royalties),
//             signatures: assetType.signatures || [],
//           },
//         ],
//       );
//     case AssetClassEnum.ERC1155_LAZY:
//       return defaultAbiCoder.encode(
//         [
//           'address contract',
//           'tuple(uint256 tokenId, string uri, uint256 supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
//         ],
//         [
//           assetType.contract,
//           {
//             tokenId: assetType.tokenId,
//             uri: assetType.uri,
//             supply: assetType.supply,
//             creators: encodeV2OrderData(assetType.creators),
//             royalties: encodeV2OrderData(assetType.royalties),
//             signatures: assetType.signatures || [],
//           },
//         ],
//       );
//     default:
//       throw Error('Unknown rarible asset data');
//   }
// };

export const decodeAssetData = (
  // assetType: Types.LocalAssetType,
  assetTypeHash: string,
  data: string,
) => {
  let decodedAssetData;
  // switch (assetType.assetClass) {
  switch (assetTypeHash) {
    case constants.ETH:
      return {
        assetClass: decodeAssetClass(assetTypeHash),
      };
    case constants.ERC20:
    case constants.COLLECTION:
      // decodedAssetData = defaultAbiCoder.decode(['(address token)'], data);
      return {
        assetClass: decodeAssetClass(assetTypeHash),
        contract: data,
      };
    case constants.ERC721:
    case constants.ERC1155:
      decodedAssetData = defaultAbiCoder.decode(
        ['(address token, uint tokenId)'],
        data,
      );
      return {
        assetClass: decodeAssetClass(assetTypeHash),
        contract: decodedAssetData[0][0].toString(),
        tokenId: decodedAssetData[0][1].toString(),
      };
    // return defaultAbiCoder.decode(['address token', 'uint256 tokenId'], data);
    // case AssetClassEnum.ERC721_LAZY:
    //   return defaultAbiCoder.decode(
    //     [
    //       'address contract',
    //       'tuple(uint256 tokenId, string uri, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
    //     ],
    //     data,
    //   );
    // case AssetClassEnum.ERC1155_LAZY:
    //   return defaultAbiCoder.decode(
    //     [
    //       'address contract',
    //       'tuple(uint256 tokenId, string uri, uint256 supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
    //     ],
    //     data,
    //   );
    default:
      throw Error('Unknown rarible asset data');
  }
};

export const decodeAssetClass = (assetTypeHash: string) => {
  switch (assetTypeHash) {
    case constants.ETH:
      return AssetClassEnum.ETH;
    case constants.ERC20:
      return AssetClassEnum.ERC20;
    case constants.COLLECTION:
      return AssetClassEnum.COLLECTION;
    case constants.ERC721:
      return AssetClassEnum.ERC721;
    case constants.ERC1155:
      return AssetClassEnum.ERC1155;
    default:
      throw Error('Unknown rarible asset data');
  }
};

const dataTypes = {
  '0x23d235ef': ORDER_DATA_TYPES.V2,
  '0x4c234266': ORDER_DATA_TYPES.V1,
  '0x31dbbba7': ORDER_DATA_TYPES.LEGACY,
  '0xfddd8b1c': ORDER_DATA_TYPES.API_V1,
  '0x62622660': ORDER_DATA_TYPES.API_V3_BUY,
  '0x6e3114ac': ORDER_DATA_TYPES.API_V3_SELL,
  '0x1b18cdf6': ORDER_DATA_TYPES.V3_BUY,
  '0x2fa3cfd3': ORDER_DATA_TYPES.V3_SELL,
  '0xeb9678fe': ORDER_DATA_TYPES.API_V2,
  '0xe57e4146': ORDER_DATA_TYPES.DEFAULT_DATA_TYPE,
};

export const getDecodedOrderData = (dataTypeHash: string) =>
  Object.entries(dataTypes).filter(([key]) => key === dataTypeHash);
