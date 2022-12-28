import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { FilterTokenDto } from 'src/tokens/dto/filter-token.dto';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { CollectionsService } from './collections.service';
import { AveragePriceOutput } from './dto/averageprice-collection.dto';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { DeleteCollectionsInput } from './dto/delete-collections.input';
import { FilterDto } from './dto/filter.collections.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UniqueOwnersOuput } from './dto/owners-collection.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { VolumeOutput } from './dto/volume-collection.dto';
import { Collections } from './entities/collections.entity';

@Resolver(() => Collections)
export class CollectionsResolver extends BaseProvider<Collections | FilterDto> {
  constructor(
    private readonly tokenService: TokensService,
    private readonly collectionsService: CollectionsService,
  ) {
    super();
  }
  /**
   * Create Collections
   * @param createCollectionsInput
   * @returns Created  Collection
   */
  @Mutation(() => Collections, { name: 'CreateCollection' })
  async create(
    @Args('CreateCollectionInput')
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      return await this.collectionsService.create(createCollectionsInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET All Collections
   * @returns Collections Array and their total count
   */
  @Query(() => GetAllCollections, { name: 'GetAllCollections' })
  async index(
    @Args('FilterCollectionInput', { nullable: true, defaultValue: {} })
    filterCollectionInput: FilterDto,
  ): Promise<GetAllCollections> {
    return await this.collectionsService.index(filterCollectionInput);
  }

  /**
   * Get Collection By Id
   * @param collectionId
   * @returns Collection Against provided ID
   */
  @Query(() => Collections, { name: 'GetCollectionById' })
  async show(
    @Args('collectionId')
    collectionId: string,
  ): Promise<Collections> {
    try {
      return await this.collectionsService.show(collectionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collection Attribute
   * @param updateCollectionsInput
   * @returns Updated Collection
   */
  @Mutation(() => Collections, { name: 'UpdateCollection' })
  async edit(
    @Args('UpdateCollectionsInput')
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      return await this.collectionsService.update(updateCollectionsInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Collection
   * @param collectionId
   * @returns Nothing
   */
  @Mutation(() => Collections, { name: 'DeleteCollections', nullable: true })
  async delete(
    @Args({
      name: 'DeleteCollectionInput',
    })
    deleteCollectionInput: DeleteCollectionsInput,
  ): Promise<void> {
    try {
      await this.collectionsService.delete(deleteCollectionInput);
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Resolve field to link tokens with its collection
   * @param collection
   * @returns All tokens of its collection
   */
  @ResolveField('tokens', () => [Tokens], { nullable: true })
  async getTokens(
    @Parent() collection: Collections,
    @Args('FilterTokensInput', { nullable: true, defaultValue: {} })
    filterTokenDto: FilterTokenDto,
  ) {
    const { id: collectionId } = collection;
    filterTokenDto.contract = collectionId;
    const { items } = await this.tokenService.index(filterTokenDto);
    return items;
  }

  /**
   * Get Average Price Of A Collection
   * @returns Average Price Of A Collection
   */
  @Query(() => Number, { name: 'GetCollectionAveragePrice' })
  async getCollectionAveragePrice(
    @Args('collectionId')
    collectionId: string,
  ): Promise<AveragePriceOutput | null> {
    try {
      return await this.collectionsService.getOrderCollectionPrice(
        collectionId,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Volume Of A Collection Trade in Last 24 Hours
   * @returns Volumne
   */
  @Query(() => Number, { name: 'GetCollectionVolume' })
  async getCollectionVolume(
    @Args('collectionId')
    collectionId: string,
  ): Promise<VolumeOutput | null> {
    try {
      return await this.collectionsService.getCollectionVolume(collectionId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Number Of Unique Owners in a Collection
   * @returns Volumne
   */
  @Query(() => Number, { name: 'GetCollectionUniqueOwners' })
  async getNumberOfUniqueOwners(
    @Args('collectionId')
    collectionId: string,
  ): Promise<UniqueOwnersOuput | null> {
    try {
      return await this.collectionsService.getNumberOfUnqiueOwners(
        collectionId,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
