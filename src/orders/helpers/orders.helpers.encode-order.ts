import * as Types from '../types/orders.types';
import { toUtf8Bytes } from '@ethersproject/strings';
import { keccak256 } from '@ethersproject/keccak256';
import { AssetClassEnum } from '../entities/enums/orders.asset-class.enum';
import { defaultAbiCoder } from '@ethersproject/abi';
import { ORDER_DATA_TYPES } from '../constants/orders.constants.order-types';
import { getOrderSide } from '../constants/orders.constants.order-info';
import * as solidity from '@ethersproject/solidity';
import { AddressZero } from '@ethersproject/constants';

export const encodeAssetClass = (assetClass: string) => {
  if (!assetClass) {
    return '0xffffffff';
  }

  return keccak256(toUtf8Bytes(assetClass)).substring(0, 10);
};

export const encodeV2OrderData = (payments: Types.IPart[] | undefined) => {
  if (!payments) {
    return [];
  }
  return payments;
};

// V3 Order Data fields are encoded in a special way. From Rarible's docs:
// - `uint payouts`, `uint originFeeFirst`, `uint originFeeSecond`, work the same as in `V1` orders, but there is only 1 value
// and address + amount are encoded into uint (first 12 bytes for amount, last 20 bytes for address), not using `LibPart.Part` struct
export const encodeV3OrderData = (part: Types.IPart) => {
  if (!part) {
    return defaultAbiCoder.encode(['uint'], ['0']);
  }

  const { account, value } = part;
  const uint96EncodedValue = solidity.pack(['uint96'], [value]);
  const encodedData = `${uint96EncodedValue}${account.slice(2)}`;

  return encodedData;
};

export const encodeOrderData = (
  order: Types.Order | Types.TakerOrderParams,
) => {
  let encodedOrderData = '';

  switch (order.data.dataType) {
    // case ORDER_DATA_TYPES.V1:
    // case ORDER_DATA_TYPES.API_V1:
    //   const v1Data = order.data as Types.IV1OrderData;

    //   encodedOrderData = defaultAbiCoder.encode(
    //     [
    //       'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees)',
    //     ],
    //     [
    //       {
    //         payouts: encodeV2OrderData(v1Data.payouts),
    //         originFees: encodeV2OrderData(v1Data.originFees),
    //       },
    //     ],
    //   );
    //   break;

    case ORDER_DATA_TYPES.V2:
    case ORDER_DATA_TYPES.API_V2:
      const v2Data = order.data as Types.IV2OrderData;
      const side = getOrderSide(
        order.make.assetType.assetClass,
        order.take.assetType.assetClass,
      );

      const isMakeFill = side === 'buy' ? 0 : 1;

      encodedOrderData = defaultAbiCoder.encode(
        [
          'tuple(tuple(address account,uint96 value)[] payouts, tuple(address account,uint96 value)[] originFees, bool isMakeFill)',
        ],
        [
          {
            payouts: encodeV2OrderData(v2Data.payouts),
            originFees: encodeV2OrderData(v2Data.originFees),
            isMakeFill: isMakeFill,
          },
        ],
      );
      break;
    case ORDER_DATA_TYPES.V3_SELL:
    case ORDER_DATA_TYPES.API_V3_SELL:
      const v3SellData = order.data as Types.IV3OrderSellData;

      encodedOrderData = defaultAbiCoder.encode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'uint maxFeesBasePoint',
          'bytes32 marketplaceMarker',
        ],
        [
          encodeV3OrderData(v3SellData.payouts),
          encodeV3OrderData(v3SellData.originFeeFirst),
          encodeV3OrderData(v3SellData.originFeeSecond),
          // TODO: Think of how to generate when maxFeesBasePoint is not passed in case of buy orders
          v3SellData.maxFeesBasePoint || '1000',
          keccak256(toUtf8Bytes(v3SellData.marketplaceMarker || '')),
        ],
      );

      break;
    case ORDER_DATA_TYPES.V3_BUY:
    case ORDER_DATA_TYPES.API_V3_BUY:
      const v3BuyData = order.data as Types.IV3OrderBuyData;

      encodedOrderData = defaultAbiCoder.encode(
        [
          'uint payouts',
          'uint originFeeFirst',
          'uint originFeeSecond',
          'bytes32 marketplaceMarker',
        ],
        [
          encodeV3OrderData(v3BuyData.payouts),
          encodeV3OrderData(v3BuyData.originFeeFirst),
          encodeV3OrderData(v3BuyData.originFeeSecond),
          keccak256(toUtf8Bytes(v3BuyData.marketplaceMarker || '')),
        ],
      );
      break;
    default:
      throw Error('Unknown rarible order type');
  }
  return encodedOrderData;
};

export const encodeAssetData = (assetType: Types.LocalAssetType) => {
  switch (assetType.assetClass) {
    case AssetClassEnum.ETH:
      return '0x';
    case AssetClassEnum.ERC20:
    case AssetClassEnum.COLLECTION:
      return defaultAbiCoder.encode(['address'], [assetType.contract]);
    case AssetClassEnum.ERC721:
    case AssetClassEnum.ERC1155:
      return defaultAbiCoder.encode(
        ['address', 'uint256'],
        [assetType.contract, assetType.tokenId],
      );
    case AssetClassEnum.ERC721_LAZY:
      return defaultAbiCoder.encode(
        [
          'address contract',
          'tuple(uint256 tokenId, string uri, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
        ],
        [
          assetType.contract,
          {
            tokenId: assetType.tokenId,
            uri: assetType.uri,
            creators: encodeV2OrderData(assetType.creators),
            royalties: encodeV2OrderData(assetType.royalties),
            signatures: assetType.signatures || [],
          },
        ],
      );
    case AssetClassEnum.ERC1155_LAZY:
      return defaultAbiCoder.encode(
        [
          'address contract',
          'tuple(uint256 tokenId, string uri, uint256 supply, tuple(address account, uint96 value)[] creators, tuple(address account, uint96 value)[] royalties, bytes[] signatures)',
        ],
        [
          assetType.contract,
          {
            tokenId: assetType.tokenId,
            uri: assetType.uri,
            supply: assetType.supply,
            creators: encodeV2OrderData(assetType.creators),
            royalties: encodeV2OrderData(assetType.royalties),
            signatures: assetType.signatures || [],
          },
        ],
      );
    default:
      throw Error('Unknown rarible asset data');
  }
};

/**
 * Encode Order object for contract calls
 * @param order
 * @returns encoded order which is ready to be signed
 */
export const encodeForMatchOrders = (
  order: Types.Order | Types.TakerOrderParams,
) => {
  console.log(order, 'in encode ');
  return {
    maker: order.maker,
    makeAsset: {
      assetType: {
        assetClass: encodeAssetClass(order.make.assetType.assetClass),
        data: encodeAssetData(order.make.assetType),
      },
      value: order.make.value,
    },
    taker: order.taker || AddressZero,
    takeAsset: {
      assetType: {
        assetClass: encodeAssetClass(order.take.assetType.assetClass),
        data: encodeAssetData(order.take.assetType),
      },
      value: order.take.value,
    },
    salt: order.salt,
    start: order.start || 0,
    end: order.end || 0,
    dataType: encodeAssetClass(order.data?.dataType ?? undefined),
    data: encodeOrderData(order),
  };
};
