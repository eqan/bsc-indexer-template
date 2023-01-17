import { Injectable } from '@nestjs/common';
import { toAddress } from '@rarible/types';
import { CollectionMeta } from '../dto/nestedObjects/collections.meta.dto';
import {
  NftCollection,
  NftCollectionStatus,
  NftCollectionType,
} from '../dto/nft-collection.dto';
import { Collections } from '../entities/collections.entity';
import { CollectionFeature } from '../entities/enum/collection.type.enum';

@Injectable()
export class NftCollectionConverter {
  convert(collection: Collections, meta: CollectionMeta): NftCollection {
    return {
      id: toAddress(collection.id),
      type: NftCollectionType[collection.type],
      status: NftCollectionStatus.CONFIRMED,
      owner: toAddress(collection.owner),
      name: collection.name,
      symbol: collection.symbol,
      features: collection.features,
      supportsLazyMint: collection.features.includes(
        CollectionFeature.MINT_AND_TRANSFER,
      ),
      minters: [toAddress(collection.owner)],
      meta,
      isRaribleContract: false,
    };
  }
}
