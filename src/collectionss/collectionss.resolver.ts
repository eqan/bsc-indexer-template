import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CollectionssService } from './collectionss.service';
import { Collectionss } from './entities/collectionss.entity';
import { CreateCollectionssInput } from './dto/create-collectionss.input';
import { UpdateCollectionssInput } from './dto/update-collectionss.input';

@Resolver(() => Collectionss)
export class CollectionssResolver {
  constructor(private readonly collectionssService: CollectionssService) {}

  /**
   * Create Collections
   * @param createCollectionssInput
   * @returns
   */
  @Mutation(() => Collectionss, { name: 'createCollection' })
  createCollectionss(
    @Args('createCollection')
    createCollectionssInput: CreateCollectionssInput,
  ) {
    return this.collectionssService.createCollection(createCollectionssInput);
  }

  /**
   * GET All Collections
   * @returns
   */
  @Query(() => [Collectionss], { name: 'getAllcollectionss' })
  getAllCollections() {
    return this.collectionssService.findAllCollectionss();
  }

  /**
   * Get Collection By Id
   * @param collection_id
   * @returns
   */
  @Query(() => Collectionss, { name: 'getCollectionById' })
  getCollectionById(
    @Args('collection_id', { type: () => String }) collection_id: string,
  ) {
    return this.collectionssService.getCollectionById(collection_id);
  }

  /**
   * Update Collection Attribute
   * @param updateCollectionssInput
   * @returns
   */
  @Mutation(() => Collectionss, { name: 'updateCollectionAtribute' })
  updateCollectionss(
    @Args('updateCollectionssInput')
    updateCollectionssInput: UpdateCollectionssInput,
  ) {
    return this.collectionssService.updateCollectionAttribute(
      updateCollectionssInput,
    );
  }

  /**
   * Remove Collection
   * @param collection_id
   * @returns
   */
  @Mutation(() => String, { name: 'deleteCollection' })
  removeCollectionss(
    @Args('id', { type: () => String }) collection_id: string,
  ) {
    return this.collectionssService.remove(collection_id);
  }
}
