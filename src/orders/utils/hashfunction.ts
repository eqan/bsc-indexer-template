import { id } from '@ethersproject/hash';
import { TypedDataUtils } from 'ethers-eip712';
import { solidityKeccak256 } from 'ethers/lib/utils';
import * as Addresses from '../constants/orders.constants.addresses';
import { OrderFormAsset } from '../dto/nestedObjectsDto/asset.dto';
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

export function convertDtoToHash(dto: any) {
  const dtoString = JSON.stringify(dto);
  const stringHash = solidityKeccak256(['string'], [dtoString]);
  return stringHash.toString();
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
  const hashedDto = convertDtoToHash(data);
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
          data: hashedDto, // need to change. this will be hashed asset data
        },
        value: String(make.value),
      },
      taker,
      takeAsset: {
        assetType: {
          assetClass: id(take.assetType.assetClass).slice(0, 10),
          data: hashedDto, // need to change. this will be hashed asset data
        },
        value: String(take.value),
      },
      salt,
      start: String(start),
      end: String(end),
      dataType: id(dataType).slice(0, 10),
      data: hashedDto, // need to change. this will be hashed asset data
    },
    {
      AssetType: EIP712_TYPES.AssetType,
      Asset: EIP712_TYPES.Asset,
      Order: EIP712_TYPES.Order,
    },
  );
  return hashedData;
}
