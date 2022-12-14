import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { SystemErrors } from 'src/constants/errors.enum';
import { In, Repository } from 'typeorm';
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
  ) {
    // const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    // const schema = {
    //   properties: {
    //     foo: { type: 'int32' },
    //   },
    //   optionalProperties: {
    //     bar: { type: 'string' },
    //   },
    // };
    // const validate = ajv.compile(schema);
    // console.log('values');
    // const data = {
    //   foo: 1,
    //   bar: 'abc',
    // };
    // const valid = validate(data);
    // if (!valid) console.log(validate.errors);
    // const data = {
    //   orderId: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
    //   maker: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
    //   Make: {
    //     type: {
    //       type: 'BEP721',
    //       contract: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
    //       tokenId: 9,
    //     },
    //     value: 8,
    //   },
    //   take: {
    //     type: {
    //       type: 'BEP721',
    //       contract: '0x31796Ef240740E6c25e501Cf202AC910Db0fe062',
    //       tokenId: 9,
    //     },
    //     value: 8,
    //   },
    //   salt: '849388498',
    // };
    // const signature = generateSignature(data);
    // const verified = verifyOrder(data, signature);
    // console.log(verified, 'data verified');
  }

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
      console.log('hello', createOrdersInput);
      // const order = {
      //   orderId,
      //   maker: toAddress(maker),
      //   make: Make,
      //   take,
      //   salt,
      //   signature,
      //   data,
      //   type: '"RARIBLE_V2"',
      // };
      const orderExists = await this.orderExistOrNot(createOrdersInput.orderId);
      if (!orderExists) {
        console.log(createOrdersInput, 'order logged');
        this.ordersHelpers.checkSignature(createOrdersInput as any);
        // console.log(verified, 'verified');
        // const verified = verifyOrder(
        //   createOrdersInput,
        //   this.rpcProvider.baseProvider,
        // );
        // if (0) {
        const order = this.ordersRepo.create(createOrdersInput);
        return await this.ordersRepo.save(order);
        // return { name: 'nimra' };
        // } else throw new BadRequestException('decryption failed');
      } else throw new BadRequestException('order already exists');
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
}
