import { TypedDataUtils } from 'ethers-eip712';
import * as Addresses from '../constants/orders.constants.addresses';
import { EIP712_TYPES } from '../types/orders.types';

function hash(
  domainData: object,
  primaryType: string,
  message: object,
  types: object,
): Uint8Array {
  const typedData = {
    types: Object.assign(
      {
        EIP712Domain: EIP712_TYPES.EIP712Domain,
      },
      types,
    ),
    domain: domainData,
    primaryType: primaryType,
    message: message,
  };
  const digest = TypedDataUtils.encodeDigest(typedData);
  return digest;
}

export function hashForm(
  maker: string,
  makeAssetType: JSON,
  takeAssetType: JSON,
  salt: string,
  data: JSON,
  chainId: number,
): Uint8Array {
  const hashedData = hash(
    {
      name: 'Exchange',
      version: '2',
      chainId: this.rpcProvider.chainId,
      verifyingContract: Addresses.Exchange[chainId],
    },
    'Exchange',
    {
      maker,
      makeAssetType,
      takeAssetType,
      salt,
      data,
    },
    {
      AssetType: EIP712_TYPES.AssetType,
      Asset: EIP712_TYPES.Asset,
      Order: EIP712_TYPES.Order,
    },
  );
  return hashedData;
}
