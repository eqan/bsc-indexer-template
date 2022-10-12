import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CollectionsService } from './collections.service';
import { Collections } from './entities/collections.entity';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { DeleteCollectionsInput } from './dto/delete-collectionss.input';
import { BadRequestException } from '@nestjs/common';
import { GetAllCollections } from './dto/get-all-collections.dto';

@Resolver(() => Collections)
export class CollectionsResolver {
  constructor(private readonly collectionsService: CollectionsService) {
    // super();
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
  async create(
    @Args('createCollection')
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    return await this.collectionsService.createCollection(
      createCollectionsInput,
    );
  }

  /**
   * GET All Collections
   * @returns Collections Array and their total count
   */
  @Query(() => GetAllCollections, { name: 'GetAllCollections' })
  async index(): Promise<GetAllCollections> {
    return await this.collectionsService.findAllCollections();
  }

  /**
   * Get Collection By Id
   * @param collectionId
   * @returns Collection Against provided ID
   */
  @Query(() => Collections, { name: 'showCollectionById' })
  async show(@Args('collectionId') collectionId: string): Promise<Collections> {
    try {
      return await this.collectionsService.getCollectionById(collectionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collection Attribute
   * @param updateCollectionssInput
   * @returns Updated Collection
   */
  @Mutation(() => Collections, { name: 'updateCollectionAtribute' })
  async edit(
    @Args('updateCollectionssInput')
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      return await this.collectionsService.updateCollectionAttribute(
        updateCollectionsInput,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Collection
   * @param collectionId
   * @returns Nothing
   */
  @Mutation(() => Collections, { nullable: true })
  async delete(
    @Args({
      name: 'deleteCollectionInput',
    })
    deleteCollectionInput: DeleteCollectionsInput,
  ): Promise<void> {
    try {
      await this.collectionsService.delete(deleteCollectionInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
