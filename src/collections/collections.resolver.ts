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
import { NftTokenId } from 'src/repositories/tokenIdRepository/dto/nft-tokenid.dto';
import { FilterTokenDto } from 'src/tokens/dto/filter-token.dto';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { CollectionsService } from './collections.service';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { DeleteCollectionsInput } from './dto/delete-collections.input';
import { FilterDto } from './dto/filter.collections.dto';
import { GenerateTokenIdInput } from './dto/generate-tokenid.input';
import { FilterTokensByPriceRangeDto } from './dto/filter-tokens-by-price-range.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
import { CollectionUniqueItems } from './dto/get-collectionUniqueItems.dto';
import { FilterTokenAttributesDto } from 'src/tokens/dto/filter-token-attributes.dto';

@Resolver(() => Collections)
export class CollectionsResolver extends BaseProvider<Collections | FilterDto> {
  constructor(
    private readonly tokenService: TokensService,
    private readonly collectionsService: CollectionsService,
  ) {
    super();
  }

  /**
   * Generate new tokenid
   * @param GenerateTokenIdInput
   * @returns tokenid
   */
  @Mutation(() => NftTokenId, { name: 'GenerateNftTokenId' })
  async generateNftTokenId(
    @Args('generateTokenIdInput')
    generateTokenIdInput: GenerateTokenIdInput,
  ): Promise<NftTokenId> {
    try {
      return await this.collectionsService.generateId(
        generateTokenIdInput.collectionId,
        generateTokenIdInput.minter,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
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
   * Return unique propeties and sub properites of a Collection
   * @param FilterTokenAttributesDto
   * @returns Parent Properties & Sub Properties
   */
  @Query(() => CollectionUniqueItems, {
    nullable: true,
    name: 'GetUniqueItems',
  })
  async getCollectionUniqueItems(
    @Args('FilterTokenAttributesDto')
    filterTokenAttributesDto: FilterTokenAttributesDto,
  ): Promise<CollectionUniqueItems> {
    try {
      return await this.tokenService.getTokenAttributesById(
        filterTokenAttributesDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Average Price Of A Collection
   * @param collectionId
   * @returns Average Price Of A Collection
   */
  @Query(() => Number, { name: 'GetCollectionAveragePrice' })
  async getCollectionAveragePrice(
    @Args('collectionId')
    collectionId: string,
  ): Promise<number> {
    try {
      return await this.collectionsService.getOrderCollectionAveragePrice(
        collectionId,
      );
    } catch (error) {
      return this.collectionsService.normalizeData(error);
    }
  }

  /**
   * Get Floor Price Of A Collection
   * @param collectionId
   * @returns Average Price Of A Collection
   */
  @Query(() => Number, { name: 'GetCollectionFloorPrice', nullable: true })
  async getCollectionFloorPrice(
    @Args('collectionId')
    collectionId: string,
  ): Promise<number | null> {
    try {
      return await this.collectionsService.getOrderCollectionFloorPrice(
        collectionId,
      );
    } catch (error) {
      return this.collectionsService.normalizeData(error);
    }
  }

  /**
   * Get Volume Of A Collection Trade in Last 24 Hours
   * @param collectionId
   * @returns Volumne
   */
  @Query(() => Number, { name: 'GetCollectionVolume' })
  async getCollectionVolume(
    @Args('collectionId')
    collectionId: string,
  ): Promise<number> {
    try {
      return await this.collectionsService.getCollectionVolume(collectionId);
    } catch (error) {
      return this.collectionsService.normalizeData(error);
    }
  }

  /**
   * Get Number Of Unique Owners in a Collection
   * @param collectionId
   * @returns Volumne
   */
  @Query(() => Number, { name: 'GetCollectionUniqueOwners' })
  async getNumberOfUniqueOwners(
    @Args('collectionId')
    collectionId: string,
  ): Promise<number> {
    try {
      return await this.collectionsService.getNumberOfUniqueOwners(
        collectionId,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //  Sort and Filter the collection tokens for provided range
  //  @param FilterTokensByPriceRangeDto
  //  @returns Tokens
  @Mutation(() => [Tokens], { name: 'filterTokensByPriceRange' })
  async filterTokensByPriceRange(
    @Args('FilterTokensByPriceRangeDto')
    filterTokensByPriceRangeDto: FilterTokensByPriceRangeDto,
  ) {
    try {
      const tokens = await this.collectionsService.filterTokensByPriceRange(
        filterTokensByPriceRangeDto,
      );
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
