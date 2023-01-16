import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Address } from '@rarible/types';
import { CustomAddressScalar } from 'src/core/customScalars/address';
import { CollectionFeature } from '../entities/enum/collection.type.enum';
import { CollectionMeta } from './nestedObjects/collections.meta.dto';

export enum NftCollectionStatus {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  CONFIRMED = 'CONFIRMED',
}

registerEnumType(NftCollectionStatus, {
  name: 'NftCollectionStatus',
  description: 'Nft Collection status',
});

export enum NftCollectionType {
  BEP721 = 'BEEP721',
  BEP1155 = 'BEP1155',
}

registerEnumType(NftCollectionType, {
  name: 'NftCollectionType',
  description: 'Nft collection type',
});

@ObjectType('NftCollection')
export class NftCollection {
  @Field(() => CustomAddressScalar)
  id: Address;

  @Field(() => NftCollectionType)
  type: NftCollectionType;

  @Field(() => String)
  status?: NftCollectionStatus;

  @Field(() => CustomAddressScalar)
  owner?: Address;

  @Field(() => String)
  name: string;

  @Field(() => String)
  symbol?: string;

  @Field(() => [CollectionFeature])
  features: CollectionFeature[];

  @Field(() => Boolean)
  supportsLazyMint: boolean;

  @Field(() => [CustomAddressScalar])
  minters?: Address[];

  @Field(() => CollectionMeta)
  meta?: CollectionMeta;

  @Field(() => Boolean)
  isRaribleContract?: boolean;
}

@ObjectType('GetAllNftCollection')
export class GetAllNftCollection {
  @Field(() => [NftCollection])
  items: NftCollection[];

  @Field(() => Int)
  total: number;
}
