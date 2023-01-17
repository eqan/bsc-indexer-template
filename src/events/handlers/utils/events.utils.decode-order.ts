import { defaultAbiCoder } from '@ethersproject/abi';
import { bigNumber } from 'src/common/utils.common';
import { AssetClassEnum } from 'src/orders/entities/enums/orders.asset-class.enum';
import { ORDER_DATA_TYPES } from '../../../orders/constants/orders.constants.order-types';
import { encodeAssetClass } from '../../../orders/helpers/orders.helpers.encode-order';
import * as constants from '../utils/events.utils.constants.order';

export const docodePart = (parts: []) =>
  parts?.map((part) => ({
    account: part[0],
    value: bigNumber(part[1]).toString(),
  }));

export const decodeOrderData = (dataType: string, data: string) => {
  let decodedOrderData: any;

  switch (dataType) {
    // case encodeAssetClass(ORDER_DATA_TYPES.V1):
    // case encodeAssetClass(ORDER_DATA_TYPES.API_V1):
    //   decodedOrderData = defaultAbiCoder.decode(
    //     [
    //       'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees)',
    //     ],
    //     data,
    //   );
    //   return {
    //     dataType: getDecodedOrderData(dataType)[0][1],
    //     payouts: docodePart(decodedOrderData[0][0]),
    //     originFees: docodePart(decodedOrderData[0][1]),
    //   };

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
        payouts: docodePart(decodedOrderData[0][0]),
        originFees: docodePart(decodedOrderData[0][1]),
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
};

export const decodeAssetData = (assetTypeHash: string, data: string) => {
  let decodedAssetData: any;
  switch (assetTypeHash) {
    case constants.ETH:
      return {
        assetClass: decodeAssetClass(assetTypeHash),
      };
    case constants.ERC20:
    case constants.COLLECTION:
      decodedAssetData = defaultAbiCoder.decode(['(address token)'], data);
      return {
        assetClass: decodeAssetClass(assetTypeHash),
        contract: decodedAssetData[0][0].toString(),
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
  // '0x4c234266': ORDER_DATA_TYPES.V1,
  // '0x31dbbba7': ORDER_DATA_TYPES.LEGACY,
  // '0xfddd8b1c': ORDER_DATA_TYPES.API_V1,
  '0x62622660': ORDER_DATA_TYPES.API_V3_BUY,
  '0x6e3114ac': ORDER_DATA_TYPES.API_V3_SELL,
  '0x1b18cdf6': ORDER_DATA_TYPES.V3_BUY,
  '0x2fa3cfd3': ORDER_DATA_TYPES.V3_SELL,
  '0xeb9678fe': ORDER_DATA_TYPES.API_V2,
  '0xe57e4146': ORDER_DATA_TYPES.DEFAULT_DATA_TYPE,
};

export const getDecodedOrderData = (dataTypeHash: string) =>
  Object.entries(dataTypes).filter(([key]) => key === dataTypeHash);
