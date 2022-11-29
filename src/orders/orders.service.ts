import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemErrors } from 'src/constants/errors.enum';
import { In, Repository } from 'typeorm';
import { CreateOrdersInput } from './dto/create-orders.input';
import { FilterOrderDto } from './dto/filter.orders.dto';
import { GetAllOrders } from './dto/get-all-orders.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { Orders } from './entities/orders.entity';
import { generateSignature, verifyOrder } from './helper.orders';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepo: Repository<Orders>,
  ) {
    const data = {
      orderId: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
      maker: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
      Make: {
        type: {
          type: 'BEP721',
          contract: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
          tokenId: 9,
        },
        value: 8,
      },
      take: {
        type: {
          type: 'BEP721',
          contract: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
          tokenId: 9,
        },
        value: 8,
      },
      salt: '849388498',
    };
    // const signature = generateSignature(data);
    // const verified = verifyOrder(data, signature);
    // console.log(verified, 'data verified');
  }

  /**
   * Create Order
   * @params createOrdersinput
   * @return order
   */
  async createOrder(createOrdersInput: CreateOrdersInput): Promise<Orders> {
    try {
      const { orderId, maker, Make, take, salt, signature } = createOrdersInput;
      const data = { orderId, maker, Make, take, salt };
      const verified = verifyOrder(data, signature);
      if (verified) {
        const order = this.ordersRepo.create(createOrdersInput);
        return await this.ordersRepo.save(order);
      } else throw new BadRequestException('decryption failed');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get /Searched Order
   * @param filterOrderDto
   * @returns Orders Array or order against specific parameter
   */
  async findAllOrders(filterOrderDto: FilterOrderDto): Promise<GetAllOrders> {
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
            orderId: rest.orderId,
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
  async getOrderById(orderId: string): Promise<Orders> {
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
  async deleteOrder(deletewithIds: { id: string[] }): Promise<void> {
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
  async updateOrderStatus(
    updateOrderStatus: UpdateOrderStatus,
  ): Promise<Orders> {
    try {
      const { orderId, ...rest } = updateOrderStatus;
      await this.ordersRepo.update({ orderId }, rest);
      return this.getOrderById(orderId);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_ORDER);
    }
  }
}
