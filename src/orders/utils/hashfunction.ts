import { id } from '@ethersproject/hash';
import { TypedDataUtils } from 'ethers-eip712';
import * as Addresses from '../constants/orders.constants.addresses';
import { AssetType, OrderFormAsset } from '../dto/nestedObjectsDto/asset.dto';
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

export function hashForm({
  maker,
  make,
  taker,
  take,
  salt,
  start,
  end,
  dataType,
  data,
  chainId,
}: {
  maker: string;
  make: OrderFormAsset;
  taker: string;
  take: OrderFormAsset;
  salt: string; // need to change in number
  start: number;
  end: number;
  dataType: string;
  data: DataDto;
  chainId: string;
}): Uint8Array {
  console.log(start, end, dataType, 'value is here');
  const hashedData = hash(
    {
      name: 'Exchange',
      version: '2',
      chainId: chainId,
      verifyingContract: Addresses.Exchange[chainId],
    },
    'Order',
    {
      maker,
      makeAsset: {
        assetType: {
          assetClass: id(make.assetType.assetClass).slice(0, 10),
          data: '0x', // need to change. this will be hashed asset data
        },
        value: make.value.toString(),
      },
      taker,
      takeAsset: {
        assetType: {
          assetClass: id(take.assetType.assetClass).slice(0, 10),
          data: '0x', // need to change. this will be hashed asset data
        },
        value: take.value.toString(),
      },
      salt,
      start: start.toString(),
      end: end.toString(),
      dataType: id(dataType).slice(0, 10),
      data: '0x', // need to change this to order data hash.
    },
    {
      AssetType: EIP712_TYPES.AssetType,
      Asset: EIP712_TYPES.Asset,
      Order: EIP712_TYPES.Order,
    },
  );
  return hashedData;
}
