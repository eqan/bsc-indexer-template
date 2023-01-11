import {
  ORDER_DATA_TYPES,
  ORDER_TYPES,
} from '../constants/orders.constants.order-types';

export const EIP712_TYPES = {
  EIP712Domain: [
    { type: 'string', name: 'name' },
    { type: 'string', name: 'version' },
    { type: 'uint256', name: 'chainId' },
    { type: 'address', name: 'verifyingContract' },
  ],
  Part: [
    { name: 'account', type: 'address' },
    { name: 'value', type: 'uint96' },
  ],
  Mint1155: [
    { name: 'tokenId', type: 'uint256' },
    { name: 'supply', type: 'uint256' },
    { name: 'tokenURI', type: 'string' },
    { name: 'creators', type: 'Part[]' },
    { name: 'royalties', type: 'Part[]' },
  ],
  Mint721: [
    { name: 'tokenId', type: 'uint256' },
    { name: 'tokenURI', type: 'string' },
    { name: 'creators', type: 'Part[]' },
    { name: 'royalties', type: 'Part[]' },
  ],
  AssetType: [
    { name: 'assetClass', type: 'bytes4' },
    { name: 'data', type: 'bytes' },
  ],
  Asset: [
    { name: 'assetType', type: 'AssetType' },
    { name: 'value', type: 'uint256' },
  ],
  Order: [
    { name: 'maker', type: 'address' },
    { name: 'makeAsset', type: 'Asset' },
    { name: 'taker', type: 'address' },
    { name: 'takeAsset', type: 'Asset' },
    { name: 'salt', type: 'uint256' },
    { name: 'start', type: 'uint256' },
    { name: 'end', type: 'uint256' },
    { name: 'dataType', type: 'bytes4' },
    { name: 'data', type: 'bytes' },
  ],
};

export type OrderKind = 'single-token' | 'contract-wide';

export interface IPart {
  account: string;
  value: string;
}

export type LocalAssetType = {
  assetClass: string;
  contract?: string;
  tokenId?: string;
  uri?: string;
  supply?: string;
  creators?: IPart[];
  royalties?: IPart[];
  signatures?: string[];
};

export interface ILegacyOrderData {
  '@type'?: string;
  dataType: ORDER_DATA_TYPES;
  fee: number;
}
export interface IV1OrderData {
  '@type'?: string;
  dataType: ORDER_DATA_TYPES;
  payouts: IPart[];
  originFees: IPart[];
}
export interface IV2OrderData {
  '@type'?: string;
  dataType: ORDER_DATA_TYPES;
  payouts: IPart[];
  originFees: IPart[];
}
export interface IV3OrderSellData {
  '@type'?: string;
  dataType: ORDER_DATA_TYPES;
  payouts: IPart;
  originFeeFirst: IPart;
  originFeeSecond: IPart;
  maxFeesBasePoint: number;
  marketplaceMarker: string;
}

export interface IV3OrderBuyData {
  '@type'?: string;
  dataType: ORDER_DATA_TYPES;
  payouts: IPart;
  originFeeFirst: IPart;
  originFeeSecond: IPart;
  marketplaceMarker: string;
}

export type LocalAsset = {
  // Comes from API
  type?: any;
  assetType: LocalAssetType;
  value: string;
};

export type TakerOrderParams = {
  type: string;
  maker: string;
  taker: string;
  make: LocalAsset;
  take: LocalAsset;
  salt: number;
  start: number;
  end: number;
  data:
    | ILegacyOrderData
    | IV1OrderData
    | IV2OrderData
    | IV3OrderSellData
    | IV3OrderBuyData;
};

export type Order = {
  kind?: OrderKind;
  hash?: string;
  id?: string;
  type: ORDER_TYPES;
  maker: string;
  make: LocalAsset;
  taker: string;
  take: LocalAsset;
  salt: string;
  start: number;
  end: number;
  data:
    | ILegacyOrderData
    | IV1OrderData
    | IV2OrderData
    | IV3OrderSellData
    | IV3OrderBuyData;
  signature?: string;
  side?: string;
  createdAt?: string;
  endedAt?: string;
};
