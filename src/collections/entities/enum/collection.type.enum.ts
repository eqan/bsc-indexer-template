import { id } from '@ethersproject/hash';
import { registerEnumType } from '@nestjs/graphql';
import { Binary, toBinary } from '@rarible/types';

export enum CollectionType {
  BEP20 = 'BEP20',
  BEP721 = 'BEEP721',
  BEP1155 = 'BEP1155',
  NONE = 'NONE',
}
export enum CollectionFeature {
  APPROVE_FOR_ALL = 'APPROVE_FOR_ALL',
  SET_URI_PREFIX = 'SET_URI_PREFIX',
  BURN = 'BURN',
  MINT_WITH_ADDRESS = 'MINT_WITH_ADDRESS',
  SECONDARY_SALE_FEES = 'SECONDARY_SALE_FEES',
  MINT_AND_TRANSFER = 'MINT_AND_TRANSFER',
}
registerEnumType(CollectionFeature, {
  name: 'CollectionFeature',
  description: 'Feautes of token',
});

export const CollectionFeatures: { [feature in CollectionFeature]: Binary[] } =
  {
    [CollectionFeature.APPROVE_FOR_ALL]: [
      toBinary('0x80ac58cd'),
      toBinary('0xd9b67a26'),
    ],
    [CollectionFeature.SET_URI_PREFIX]: [],
    [CollectionFeature.BURN]: [],
    [CollectionFeature.MINT_WITH_ADDRESS]: [],
    [CollectionFeature.SECONDARY_SALE_FEES]: [toBinary('0xb7799584')],
    [CollectionFeature.MINT_AND_TRANSFER]: [
      toBinary('0x8486f69f'),
      toBinary('0x6db15a0f'),
    ],
  };

export const FEATURE_SIGNATURES: { [key: string]: CollectionFeature } = {
  [id('setApprovalForAll(address,bool)')]: CollectionFeature.APPROVE_FOR_ALL,
  [id('setTokenURI(uint256,string)')]: CollectionFeature.BURN,
  [id('burn(uint256)')]: CollectionFeature.BURN,
  [id('burn(address,uint256,uint256)')]: CollectionFeature.BURN,
};

registerEnumType(CollectionType, {
  name: 'CollectionType',
  description: 'Types of tokens',
});
