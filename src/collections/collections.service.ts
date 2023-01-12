import { AbiCoder } from '@ethersproject/abi';
import { hexConcat } from '@ethersproject/bytes';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsRegistrationService } from 'src/collectionRegistrationService/collectionRegistration.service';
import { OrdersService } from 'src/orders/orders.service';
import { NftTokenId } from 'src/repositories/tokenIdRepository/dto/nft-tokenid.dto';
import { TokenIdRepository } from 'src/repositories/tokenIdRepository/tokenId.repository';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { ILike, In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterTokensByPriceRangeDto } from './dto/filter-tokens-by-price-range.dto';
import { FilterDto as FilterCollectionsDto } from './dto/filter.collections.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
import { CollectionsMetaService } from './services/collections.meta.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
    private readonly collectionsMetaService: CollectionsMetaService,
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => TokensService))
    private readonly tokenService: TokensService,
    @Inject(forwardRef(() => CollectionsRegistrationService))
    private readonly collectionRegistrationService: CollectionsRegistrationService,
    private readonly tokenIdRepository: TokenIdRepository,
  ) {}

  /**
   * Generate new token id for specific collection and minter
   * @param  collectionId
   * @param collectionId
   * @returns  new token id
   */
  async generateId(collectionId: string, minter: string): Promise<NftTokenId> {
    try {
      const collection = await this.collectionRegistrationService.register(
        collectionId,
      );
      if (!collection) {
        throw new NotFoundException(
          `Collection against ${collectionId} not found`,
        );
      }
      const tokenId = await this.tokenIdRepository.generateTokenId(
        `${collectionId}:${minter}`,
      );
      const encoder = new AbiCoder();
      const encoded = encoder.encode(['uint'], [tokenId]);
      const concated = hexConcat([
        minter,
        `0x${encoded.slice(encoded.length - 24)}`,
      ]);
      const decoded = encoder.decode(['uint'], concated)[0];

      return { tokenId: decoded.toString() };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  /**
   * Create Collection in Database
   * @param createCollectionsInput
   * @returns  Created Collection
   */
  async create(
    createCollectionsInput: CreateCollectionsInput,
  ): Promise<Collections> {
    try {
      const collection = this.collectionsRepo.create(createCollectionsInput);
      const savedCollection = await this.collectionsRepo.save(collection);
      return savedCollection;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  async index(
    filterCollectionsDto: FilterCollectionsDto,
  ): Promise<GetAllCollections> {
    try {
      const { page = 1, limit = 20, ...rest } = filterCollectionsDto;
      const [items, total] = await Promise.all([
        this.collectionsRepo.find({
          where: {
            id: rest?.id,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
            owner: rest?.owner ? ILike(`%${rest?.owner}%`) : undefined,
          },
          relations: { Meta: true },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.collectionsRepo.count({
          where: {
            id: rest?.id,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET Collection By Id
   * @param id
   * @returns Collection against Provided Id
   */
  async show(id: string): Promise<Collections> {
    try {
      const found = await this.collectionsRepo.findOneByOrFail({
        id,
      });
      if (!found) {
        throw new NotFoundException(`Collection against ${id}} not found`);
      }
      await this.collectionsMetaService.resolve(found.id);
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Check if collection exist or not
   * @param id
   * @returns Collection against Provided Id
   */
  async collectionExistOrNot(id: string): Promise<Collections> {
    try {
      return await this.collectionsRepo.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Collections
   * @param updateCollectionsInput
   * @returns
   */
  async update(
    updateCollectionsInput: UpdateCollectionsInput,
  ): Promise<Collections> {
    try {
      const { id, ...rest } = updateCollectionsInput;
      const { owner } = await this.show(id);
      if (owner != rest.owner)
        throw new UnauthorizedException('The user is not the owner');
      return await this.collectionsRepo.save(updateCollectionsInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Collection
   * @param collectionId
   * @returns Message that collection successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.collectionsRepo.delete({ id: In(ids) });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Work Under Progress
  calculateAverageCollectionPrice(id: string): string {
    try {
      const ids = id;
      // await this.collectionsRepo.delete({ id: In(ids) });
      return ids;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Filtered Tokens by Price Range
   * @param FilterTokensByPriceRangeDto
   * @returns Sorted list of Tokens
   */
  async filterTokensByPriceRange(
    filterTokensDto: FilterTokensByPriceRangeDto,
  ): Promise<Tokens[]> {
    try {
      const items = await this.ordersService.filterByPrice(filterTokensDto);
      const tokens: Tokens[] = [];
      for (const item of items) {
        const token = await this.tokenService.find(
          `${item.contract}:${item.tokenId}`,
        );
        if (token) tokens.push(token);
      }
      return tokens;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
