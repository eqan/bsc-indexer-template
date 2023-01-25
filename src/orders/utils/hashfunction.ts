import { TypedDataUtils } from 'ethers-eip712';
import * as Addresses from '../constants/orders.constants.addresses';
import { AssetType } from '../dto/nestedObjectsDto/asset.dto';
import { DataDto } from '../dto/nestedObjectsDto/data.dto';
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
  makeAssetType: AssetType,
  takeAssetType: AssetType,
  salt: string,
  data: DataDto,
  chainId: string,
  rpcProviderChainID: string,
): Uint8Array {
  const hashedData = hash(
    {
      name: 'Exchange',
      version: '2',
      chainId: rpcProviderChainID,
      verifyingContract: Addresses.Exchange[chainId],
    },
    'Order',
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
