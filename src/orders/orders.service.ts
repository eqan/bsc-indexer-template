import { MaxUint256, Zero } from '@ethersproject/constants';
import { formatEther } from '@ethersproject/units';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterTokensByPriceRangeDto } from 'src/collections/dto/filter-tokens-by-price-range.dto';
import { SortOrder } from 'src/collections/enums/collections.sort-order.enum';
import { SystemErrors } from 'src/constants/errors.enum';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { getOrderSide } from 'src/events/handlers/utils/events.utils.helpers.orders';
import { Between, In, Not, Repository } from 'typeorm';
import { CreateOnchainOrdersInput } from './dto/create-onchain.orders.input';
import { CreateOrdersInput } from './dto/create-orders.input';
import { FilterOrderDto } from './dto/filter.orders.dto';
import { GetAllOrders } from './dto/get-all-orders.dto';
import { GetOrderBidsByItemDto } from './dto/get-order-bids-by-item-dto';
import { GetOrderBidsByMakerDto } from './dto/get-order-bids-by-maker.dto';
import { GetSellOrdersByItemDto } from './dto/get-sell-orders-by-item.dto';
import { GetSellOrdersByMakerDto } from './dto/get-sell-orders-by-maker';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { OrderStatus } from './entities/enums/orders.status.enum';
import { Orders } from './entities/orders.entity';
import { OrdersHelpers } from './helpers/orders.helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepo: Repository<Orders>,
    private readonly ordersHelpers: OrdersHelpers,
  ) {}

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
        const dbOrder = this.ordersRepo.create(order);
        return await this.ordersRepo.save(dbOrder);
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
      const order = this.ordersRepo.create(createOnchainOrdersInput);
      return await this.ordersRepo.save(order);
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
          status: Not(In([OrderStatus.Filled, OrderStatus.Cancelled])),
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
            maker: In(rest.maker),
            side: OrderSide.buy,
            start: rest?.start,
            end: rest?.end,
            status: In(rest?.status),
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
            maker: In(rest.maker),
            side: OrderSide.sell,
            status: In(rest?.status),
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
      const [contract, tokenId] = getOrderBidsByItemDto.itemId.split(':');
      const { page, limit, ...rest } = getOrderBidsByItemDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            contract,
            tokenId,
            maker: In(rest?.maker),
            side: OrderSide.buy,
            start: rest?.start,
            end: rest?.end,
            status: In(rest?.status),
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
      const [contract, tokenId] = getSellOrdersByItemDto.itemId.split(':');
      const { page, limit, ...rest } = getSellOrdersByItemDto;
      const [items] = await Promise.all([
        this.ordersRepo.find({
          where: {
            contract,
            tokenId,
            maker: In(rest?.maker),
            side: OrderSide.sell,
            status: In(rest?.status),
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
}
