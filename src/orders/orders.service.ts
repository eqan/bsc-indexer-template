import { MaxUint256, Zero } from '@ethersproject/constants';
import { formatEther } from '@ethersproject/units';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toBigNumber } from '@rarible/types';
import { FilterTokensByPriceRangeDto } from 'src/collections/dto/filter-tokens-by-price-range.dto';
import { SortOrder } from 'src/collections/enums/collections.sort-order.enum';
import {
  arrayItemsToLowerCase,
  checkItemIdForamt,
} from 'src/common/utils.common';
import { SystemErrors } from 'src/constants/errors.enum';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { getOrderSide } from 'src/events/handlers/utils/events.utils.helpers.orders';
import {
  Between,
  EntityNotFoundError,
  ILike,
  In,
  Not,
  Repository,
} from 'typeorm';
import { CreateOnchainOrdersInput } from './dto/create-onchain.orders.input';
import { CreateOrdersInput } from './dto/create-orders.input';
import { FilterOrderDto } from './dto/filter.orders.dto';
import { GetAllOrders } from './dto/get-all-orders.output';
import { GetAllSellOrders } from './dto/get-all-sell-orders.output';
import { GetOrderBidsByItemDto } from './dto/get-order-bids-by-item-dto';
import { GetOrderBidsByMakerDto } from './dto/get-order-bids-by-maker.dto';
import { GetSellOrdersByItemDto } from './dto/get-sell-orders-by-item.dto';
import { GetSellOrdersByMakerDto } from './dto/get-sell-orders-by-maker';
import { GetSellOrdersDto } from './dto/get-sell-orders.dto';
import { OrderFormDto } from './dto/order-form.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/enums/orders.status.enum';
import { Orders } from './entities/orders.entity';
import { OrdersHelpers } from './helpers/orders.helpers';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import {
  LazyErc1155Input,
  LazyErc721Input,
} from 'src/tokens/dto/lazy-token-dto';
import {
  Asset,
  AssetTypeEnum,
  Erc20AssetType,
  EthAssetType,
} from './dto/nestedObjectsDto/asset.dto';
import { hashForm } from './utils/hashfunction';
import { Data } from './dto/nestedObjectsDto/data.dto';
import { AssetType } from './dto/nestedObjectsDto/asset.dto';
import { ApproveService } from 'src/approval/approve.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepo: Repository<Orders>,
    private readonly ordersHelpers: OrdersHelpers,
    private readonly approveService: ApproveService,
  ) {}
  // @InjectRepository(Tokens)
  // private tokensRepo: Repository<Tokens>,

  /**
   * Check if order exist or not
   * @param orderId
   * @returns order against Provided Id
   */
  async orderExistOrNot(orderId: string): Promise<Orders> {
    try {
      return await this.ordersRepo.findOne({ where: { orderId } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async puting(from: OrderFormDto): Promise<boolean> {
    console.log(
      JSON.stringify(from),
      from.make.assetType,
      from.make.assetType instanceof Erc20AssetType,
      from.make.assetType.assetClass == 'ERC20' && from.make.assetType.contract,
      from.make.assetType.assetClass == AssetTypeEnum.ERC721 &&
        from.make.assetType.tokenId,
    );
    const approved = await this.approveService.checkOnChainApprove(
      maker,
      make.assetType,
      data['contract'],
    );
    // val signature = commonSigner.fixSignature(form.signature)
    // return OrderVersion(
    //     maker = maker,
    //     make = make,
    //     take = take,
    //     taker = form.taker,
    //     type = OrderTypeConverter.convert(form),
    //     salt = EthUInt256.of(form.salt),
    //     start = form.start,
    //     end = form.end,
    //     data = data,
    //     signature = signature,
    //     platform = platform,
    //     hash = hash,
    //     approved = approved,
    //     makePriceUsd = null,
    //     takePriceUsd = null,
    //     makePrice = null,
    //     takePrice = null,
    //     makeUsd = null,
    //     takeUsd = null
    // ).run { priceUpdateService.withUpdatedAllPrices(this) }
  }

  // private convertFormToVersion(form: OrderFormDto): AssetType {}
  // async put(form: OrderFormDto): Promise<Orders> {
  //   // val orderVersion = convertFormToVersion(form)
  //   // orderValidator.validate(orderVersion)
  //   // val existingOrder = orderRepository.findById(orderVersion.hash)
  //   // if (existingOrder != null) {
  //   //     orderValidator.validate(existingOrder, orderVersion)
  //   // }
  //   // return orderUpdateService
  //   //     .save(orderVersion)
  //   //     .also { raribleOrderSaveMetric.increment() }
  // }

  // async convertFormToVersion(form: OrderFormDto): Promise<OrderVersion> {
  //   const maker = form.maker;
  //   const make = await this.checkLazyNftMake(maker, form.make);
  //   const take = await this.checkLazyNft(form.take);
  //   const data = form.data;
  //   // Asset: { assetType: AssetType(assetClass, assetData), value };
  //   // Order: { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data };
  //   const hash = hashForm(
  //     form.maker,
  //     make.assetType,
  //     take,
  //     form.salt,
  //     data,
  //     process.env.CHAIN_ID,
  //   );
  //   const approved = approveService.checkOnChainApprove(
  //     maker,
  //     make,
  //     data['contract'],
  //   );

  //   // val signature = commonSigner.fixSignature(form.signature)
  //   // return OrderVersion(
  //   //     maker = maker,
  //   //     make = make,
  //   //     take = take,
  //   //     taker = form.taker,
  //   //     type = OrderTypeConverter.convert(form),
  //   //     salt = EthUInt256.of(form.salt),
  //   //     start = form.start,
  //   //     end = form.end,
  //   //     data = data,
  //   //     signature = signature,
  //   //     platform = platform,
  //   //     hash = hash,
  //   //     approved = approved,
  //   //     makePriceUsd = null,
  //   //     takePriceUsd = null,
  //   //     makePrice = null,
  //   //     takePrice = null,
  //   //     makeUsd = null,
  //   //     takeUsd = null
  //   // ).run { priceUpdateService.withUpdatedAllPrices(this) }
  // }

  // async checkLazyNftMake(maker: string, asset: Asset): Promise<Asset> {
  //   const make = await this.checkLazyNftAndReturnAsset(asset);
  //   const makeType = make.assetType;
  //   if (
  //     makeType instanceof LazyErc721Input &&
  //     makeType.creators[0].account == maker
  //   ) {
  //     return make;
  //   }
  //   if (
  //     makeType instanceof LazyErc1155Input &&
  //     makeType.creators[0].account == maker
  //   ) {
  //     return make;
  //   }
  //   return asset;
  // }

  // async checkLazyNftAndReturnAsset(asset: Asset): Promise<Asset> {
  //   const data = await this.checkLazyNft(asset);
  //   const newAsset = new Asset();
  //   newAsset.assetType = data;
  //   newAsset.value = asset.value;
  //   return newAsset;
  // }

  // async checkLazyNft(asset: Asset): Promise<Data> {
  //   const data = await this.getLazyNft(
  //     asset.assetType['contract'],
  //     asset.assetType['tokenId'],
  //   );
  //   switch (asset.assetType['assetClass']) {
  //     case 'ERC721_LAZY':
  //       const lazyErc721 = new LazyErc721Input();
  //       lazyErc721.contract = data?.contract;
  //       lazyErc721.tokenId = data?.id;
  //       lazyErc721.type = 'ERC721_LAZY';
  //       lazyErc721.creators = data?.creators;
  //       lazyErc721.royalties = data?.royalties;
  //       lazyErc721.signatures = data?.signatures;
  //       return { assetType: lazyErc721 };
  //     case 'ERC1155_LAZY':
  //       const lazyErc1155 = new LazyErc1155Input();
  //       lazyErc1155.contract = data?.contract;
  //       lazyErc1155.tokenId = data?.id;
  //       lazyErc1155.type = 'ERC1155_LAZY';
  //       lazyErc1155.uri = data?.uri;
  //       lazyErc1155.supply = data?.supply;
  //       lazyErc1155.creators = data?.creators;
  //       lazyErc1155.royalties = data?.royalties;
  //       lazyErc1155.signatures = data?.signatures;
  //       return { assetType: lazyErc1155 };
  //     default:
  //       return asset.assetType;
  //   }
  // }

  // async getLazyNft(contract: string, tokenId: string): Promise<Tokens> {
  //   const itemId = contract + ':' + tokenId;
  //   const lazySupply =
  //     (await this.tokensRepo.findOneBy({ id: itemId }))?.lazySupply ??
  //     toBigNumber('0');

  //   if (lazySupply > toBigNumber('0')) {
  //     const data = await this.tokensRepo.findOneBy({ id: itemId });
  //     if (data) {
  //       return data;
  //     }
  //     throw new EntityNotFoundError('Lazy Item', itemId);
  //   } else {
  //     return null;
  //   }
  // }

  /**
   * Create Order
   * @params createOrdersinput
   * @return order
   */
  async create(createOrdersInput: CreateOrdersInput): Promise<Orders> {
    try {
      const orderExists = await this.orderExistOrNot(createOrdersInput.orderId);
      const { contract, tokenId } = createOrdersInput;
      if (!orderExists) {
        const orderInput = createOrdersInput as any;
        const side =
          createOrdersInput?.side ||
          getOrderSide(orderInput.make.assetType.assetClass);
        const order = {
          ...createOrdersInput,
          side,
        };

        //adding makePrice if order side is sell else checking
        //buy order is against valid sell order
        if (order.side === OrderSide.sell) {
          order.makePrice =
            orderInput?.makePrice || formatEther(orderInput.take.value);
        } else await this.sellOrderExistsOrNot({ contract, tokenId });

        //checking if order signature is valid or not
        this.ordersHelpers.checkSignature(createOrdersInput as any);

        //saving order in database
        // const dbOrder = this.ordersRepo.create(order);
        // return await this.ordersRepo.save(dbOrder);
        throw new BadRequestException('error');
      } else throw new BadRequestException('order already exists');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Create OnchainOrder
   * @params createOnchainOrdersinput
   * @return order
   */
  async createOnchainOrder(
    createOnchainOrdersInput: CreateOnchainOrdersInput,
  ): Promise<Orders> {
    try {
      // const order = this.ordersRepo.create(createOnchainOrdersInput);
      // return await this.ordersRepo.save(order);
      throw new BadRequestException('error');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Searched Order
   * @param filterOrderDto
   * @returns Orders Array or order against specific parameter
   */
  async index(filterOrderDto: FilterOrderDto): Promise<GetAllOrders> {
    try {
      const { page, limit, ...rest } = filterOrderDto;
      const [items, total] = await Promise.all([
        this.ordersRepo.find({
          where: {
            orderId: rest?.orderId,
            maker: rest?.maker,
            taker: rest?.taker,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.ordersRepo.count({
          where: {
            orderId: rest?.orderId,
            maker: rest?.maker,
            taker: rest?.taker,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {}
  }

  /**
   * Get Order By Id
   * @param orderId
   * @returns Order against specific id
   */
  async show(orderId: string): Promise<Orders> {
    try {
      const order = this.ordersRepo.findOneByOrFail({ orderId });
      if (!order) {
        throw new NotFoundException('No Orders Found');
      }
      return order;
    } catch (error) {
      throw new BadRequestException(SystemErrors.FIND_ORDER);
    }
  }

  /**
   * Delete Order from DB
   * @param deletewithIds
   * @returns vpoid
   */
  async delete(deletewithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deletewithIds.id;
      await this.ordersRepo.delete({ orderId: In(ids) });
      return null;
    } catch (error) {
      throw new BadRequestException(SystemErrors.DELETE_ORDER);
    }
  }

  /**
   *  Update Order status
   * @param updateOrderStatus
   * @returns Updated Order status
   */
  async update(updateOrderStatus: UpdateOrderStatus): Promise<Orders> {
    try {
      const { orderId, ...rest } = updateOrderStatus;
      await this.ordersRepo.update({ orderId }, rest);
      return this.show(orderId);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_ORDER);
    }
  }

  /**
   * Filter all orders for a specific price range
   * @param id
   * @returns Order against Provided collectionId
   */
  async filterByPrice(
    filterByPriceDto: FilterTokensByPriceRangeDto,
  ): Promise<Orders[]> {
    try {
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            contract: filterByPriceDto.collectionId,
            side: OrderSide.sell,
            makePrice: Between(
              filterByPriceDto?.min || Number(formatEther(Zero)),
              filterByPriceDto?.max || Number(formatEther(MaxUint256)),
            ),
          },
          order: {
            makePrice: filterByPriceDto?.sortOrder || SortOrder.ASC,
          },
        }),
      ]);
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Checks if the Sell Order is valid for bidding
   * @param id
   * @returns Sell Order againt provided CollectionId and TokenId
   */
  async sellOrderExistsOrNot(dto: {
    contract: string;
    tokenId: string;
  }): Promise<Orders> {
    try {
      const sellOrder = await this.ordersRepo.findOneOrFail({
        where: {
          contract: dto.contract,
          tokenId: dto.tokenId,
          side: OrderSide.sell,
          status: Not(In([OrderStatus.FILLED, OrderStatus.CANCELLED])),
          onchain: false,
        },
      });
      return sellOrder;
    } catch (error) {
      throw new Error(
        `Sell Order against ${dto.contract}:${dto.tokenId} not found or is filled or cancelled`,
      );
    }
  }

  /**
   * Get Searched Bids By Makers
   * @param  GetOrderBidsByMakerDto
   * @returns Bid Orders Array or Bid order against specific parameter
   */
  async getOrderBidsByMaker(
    getOrderBidsByMakerDto: GetOrderBidsByMakerDto,
  ): Promise<Orders[]> {
    try {
      const { page, limit, ...rest } = getOrderBidsByMakerDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            maker: In(arrayItemsToLowerCase(rest.maker)),
            side: OrderSide.buy,
            start: rest?.start,
            end: rest?.end,
            status: rest?.status ? In(rest.status) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
      ]);
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   *  Get Searched Sell Orders by Makers
   * @param getOrderBidsByMakerDto
   * @returns Sell Orders Array or Sell order against specific parameter
   */
  async getSellOrdersByMaker(
    getSellOrdersByMakerDto: GetSellOrdersByMakerDto,
  ): Promise<Orders[]> {
    try {
      const { page, limit, ...rest } = getSellOrdersByMakerDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            maker: In(arrayItemsToLowerCase(rest.maker)),
            side: OrderSide.sell,
            status: rest?.status ? In(rest.status) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
      ]);
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Searched Bids By Item
   * @param getOrderBidsByItemDto
   * @returns Bid Orders Array or Bid order against specific parameter
   */
  async getOrderBidsByItem(
    getOrderBidsByItemDto: GetOrderBidsByItemDto,
  ): Promise<Orders[]> {
    try {
      const [contract, tokenId] = checkItemIdForamt(
        getOrderBidsByItemDto.itemId,
      );
      const { page, limit, ...rest } = getOrderBidsByItemDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            maker: rest?.maker
              ? In(arrayItemsToLowerCase(rest.maker))
              : undefined,
            contract: ILike(`%${contract}%`),
            tokenId: ILike(`%${tokenId}%`),
            side: OrderSide.buy,
            start: rest?.start,
            end: rest?.end,
            status: rest?.status ? In(rest.status) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
      ]);
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Searched Sell Orders By Item
   * @param getSellOrdersByItemDto
   * @returns Orders[]
   */
  async getSellOrdersByItem(
    getSellOrdersByItemDto: GetSellOrdersByItemDto,
  ): Promise<Orders[]> {
    try {
      const [contract, tokenId] = checkItemIdForamt(
        getSellOrdersByItemDto.itemId,
      );
      const { page, limit, ...rest } = getSellOrdersByItemDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            maker: rest?.maker
              ? In(arrayItemsToLowerCase(rest.maker))
              : undefined,
            contract: ILike(`%${contract}%`),
            tokenId: ILike(`%${tokenId}%`),
            side: OrderSide.sell,
            status: rest?.status ? In(rest.status) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
      ]);
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Searched Sell Orders
   * @param getSellOrdersDto
   * @returns Orders[]
   */
  async getSellOrders(
    getSellOrdersDto: GetSellOrdersDto,
  ): Promise<GetAllSellOrders> {
    try {
      const { page, limit, ...rest } = getSellOrdersDto;
      const [items, total] = await Promise.all([
        this.ordersRepo.find({
          where: {
            status: rest?.status ? In(rest.status) : undefined,
            side: OrderSide.sell,
          },
          order: {
            createdAt: SortOrder.ASC,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.ordersRepo.count({
          where: {
            status: rest?.status ? In(rest.status) : undefined,
            side: OrderSide.sell,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Average Collection Price Of Tokens
   * @param ContractAddress
   * @returns  Average Price Of Collection
   */
  async getOrderCollectionAveragePrice(collectionId: string): Promise<number> {
    try {
      const result = await this.ordersRepo
        .createQueryBuilder('Orders')
        .select('COALESCE(AVG(Orders.makePrice), 0)', 'avg_price')
        .where('Orders.contract = :collectionId', {
          collectionId,
        })
        .getRawOne();
      return result.avg_price;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  /**
   * Get Unique Owners Of A Collection related to Orders
   * @param ContractAddress
   * @returns  Number of Unique Owners
   */
  async getNumberOfUniqueOwners(collectionId: string): Promise<number> {
    try {
      const result = await this.ordersRepo
        .createQueryBuilder('Orders')
        .select('Orders.maker', 'owner')
        .where('Orders.id = :collectionId', { collectionId })
        .groupBy('Orders.owner')
        .getCount();
      return result;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
  /**
   * Calculate the volume of a collection
   * @param id
   * @returns volume
   */
  async getOrderCollectionVolume(contract: string): Promise<number> {
    try {
      // Use the sum query builder function to sum up the "price" field of all orders that match the where clause
      const result = await this.ordersRepo
        .createQueryBuilder('Orders')
        .select('COALESCE(SUM(Orders.makePrice), 0)', 'volume')
        .where('Orders.contract = :contract', {
          contract,
        })
        .getRawOne();
      return result.volume;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
