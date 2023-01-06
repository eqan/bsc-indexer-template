import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import { ILike, In, Repository } from 'typeorm';
import { CreateCollectionsInput } from './dto/create-collections.input';
import { FilterDto as FilterCollectionsDto } from './dto/filter.collections.dto';
import { FilterTokensByPriceRangeDto } from './dto/filter-tokens-by-price-range.dto';
import { GetAllCollections } from './dto/get-all-collections.dto';
import { UpdateCollectionsInput } from './dto/update-collections.input';
import { Collections } from './entities/collections.entity';
// import { OrderMatchEvents } from 'src/events/entities/events.entity.order-match-events';
import { SortOrder } from './enums/collections.sort-order.enum';
import { Orders } from 'src/orders/entities/orders.entity';
@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collections)
    // @InjectRepository(Orders)
    @Inject(forwardRef(() => [MetadataApi]))
    private collectionsRepo: Repository<Collections>,
    // private ordersRepo: Repository<Orders>,
    // private orderMatchEventRepo: Repository<OrderMatchEvents>,
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => TokensService))
    private readonly tokenService: TokensService,
  ) {}

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

  /**
   * Get Average Collection Price Of Tokens
   * @param ContractAddress
   * @returns  Average Price Of Collection
   */
  // async getOrderCollectionAveragePrice(collectionId: string): Promise<number> {
  //   try {
  //     return await this.orderMatchEventRepo
  //       .createQueryBuilder('OrderMatchEvent')
  //       .select('AVG(OrderMatchEvent.price)', 'avg_price')
  //       .where('OrderMatchEvent.collectionId = :collectionId', {
  //         collectionId,
  //       })
  //       .getRawOne();
  //   } catch (error) {
  //     throw new NotFoundException(error);
  //   }
  // }

  /**
   * Get Average Collection Price Of Tokens
   * @param ContractAddress
   * @returns  Average Price Of Collection
   */
  async getOrderCollectionFloorPrice(
    collectionId: string,
  ): Promise<number | null> {
    try {
      const items = await this.ordersService.filterByPrice({
        collectionId,
        sortOrder: SortOrder.ASC,
      });
      return items[0].makePrice;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // /**
  //  * Get The Total Eth Value For The Last 24 Hours
  //  * @param ContractAddress
  //  * @returns  Last 24 Hours Transactions Amount
  //  */
  // async getCollectionVolume(collectionId: string): Promise<number> {
  //   try {
  //     const now = Date.now();
  //     const oneDayAgo = now - 24 * 60 * 60 * 1000;
  //     let sum = 0;
  //     const { items } = await this.orderMatchEventService.show(
  //       collectionId,
  //       oneDayAgo,
  //     );
  //     items.map((order) => {
  //       if (order.price) sum += parseFloat(order.price);
  //     });
  //     return sum;
  //   } catch (error) {
  //     throw new NotFoundException(error);
  //   }
  // }

  // /**
  //  * Get Unique owners of a collection
  //  * @param ContractAddress
  //  * @returns  Number
  //  */
  // async getNumberOfUnqiueOwners(collectionId: string): Promise<number> {
  //   try {
  //     const { items } = await this.orderMatchEventService.show(collectionId);
  //     const owners = [];
  //     let sum = 1;
  //     items.map((order) => {
  //       if (owners.includes(order.taker)) {
  //         owners.push(order.taker);
  //         sum++;
  //       }
  //     });
  //     return sum;
  //   } catch (error) {
  //     throw new NotFoundException(error);
  //   }
  // }

  normalizeData(error: string) {
    const regex = /value \"\d+\" is out of range for type integer/;

    if (regex.test(error)) {
      return 0;
    } else {
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
