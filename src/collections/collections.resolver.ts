import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import BaseProvider from 'src/core/base.BaseProvider';
// import { type } from 'os';
import { DeleteCollectionsInput } from './dto/delete-collectionss.input';
// import { DeleteCollectionssInput } from './dto/delete-collectionss.input';

@Resolver(() => Collections)
export class CollectionsResolver extends BaseProvider<Collections> {
  constructor(private readonly collectionsService: CollectionsService) {
    super();
  }
  /**
   *
   */
  // index(): Promise<{ items: Collectionss[]; total: number }> {}
  /**
   * Create Collections
   * @param createCollectionssInput
   * @returns Created  Collection
   */
  @Mutation(() => Collections, { name: 'createCollection' })
  create(
    @Args('createCollection')
    createCollectionsInput: CreateCollectionsInput,
  ) {
    return this.collectionsService.createCollection(createCollectionsInput);
  }

  /**
   * GET All Collections
   * @returns
   */
  @Query((returns) => [[Collections], Number])
  async index() {
    return this.collectionsService.findAllCollections();
  }

  /**
   * Get Collection By Id
   * @param collectionId
   * @returns Collection Against provided ID
   */
  @Query(() => Collections, { name: 'showCollectionById' })
  show(@Args('collectionId') collectionId: string) {
    return this.collectionsService.getCollectionById(collectionId);
  }

  /**
   * Update Collection Attribute
   * @param updateCollectionssInput
   * @returns Updated Collection
   */
  @Mutation(() => Collections, { name: 'updateCollectionAtribute' })
  edit(
    @Args('updateCollectionssInput')
    updateCollectionsInput: UpdateCollectionsInput,
  ) {
    return this.collectionsService.updateCollectionAttribute(
      updateCollectionsInput,
    );
  }

  /**
   * Remove Collection
   * @param collectionId
   * @returns Nothing
   */
  @Mutation(() => Collections, { nullable: true })
  delete(
    @Args({
      name: 'deleteCollectionInput',
    })
    deleteCollectionInput: DeleteCollectionsInput,
  ): void {
    this.collectionsService.delete(deleteCollectionInput);
  }
}
