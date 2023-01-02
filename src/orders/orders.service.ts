import { MaxUint256, Zero } from '@ethersproject/constants';
import { formatEther } from '@ethersproject/units';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterTokensByPriceRangeDto } from 'src/collections/dto/filterTokensByPriceRange.dto';
import { SortOrder } from 'src/collections/enums/collections.sort-order.enum';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { SystemErrors } from 'src/constants/errors.enum';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import { getOrderSide } from 'src/events/handlers/utils/events.utils.helpers.orders';
import { Between, In, Repository } from 'typeorm';
import { CreateOnchainOrdersInput } from './dto/create-onchain.orders.input';
import { CreateOrdersInput } from './dto/create-orders.input';
import { FilterOrderDto } from './dto/filter.orders.dto';
import { GetAllOrders } from './dto/get-all-orders.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { Orders } from './entities/orders.entity';
import { OrdersHelpers } from './helpers/orders.helpers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepo: Repository<Orders>,
    // private readonly ethereum: Maybe<Ethereum>,
    private readonly rpcProvider: RpcProvider,
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
      // console.log('hello', createOrdersInput);
      const orderExists = await this.orderExistOrNot(createOrdersInput.orderId);
      if (!orderExists) {
        console.log(createOrdersInput, 'order logged');
        //checking if order signature is valid or not
        this.ordersHelpers.checkSignature(createOrdersInput as any);
        const orderInput = createOrdersInput as any;
        const side =
          createOrdersInput?.side ||
          getOrderSide(orderInput.make.assetType.assetClass);
        const order = {
          ...createOrdersInput,
          side,
          makePrice:
            orderInput?.makePrice || formatEther(orderInput.take.value),
        };

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
      // console.log('hello', createOnchainOrdersInput);
      // const orderExists = await this.orderExistOrNot(
      //   createOnchainOrdersInput.orderId,
      // );
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
            // makePrice: Number(filterByPriceDto.min),
            // makePrice:
            //   Number(MoreThan(filterByPriceDto?.min || Zero)) &&
            //   Number(LessThan(filterByPriceDto?.max || MaxUint256)),
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
}
