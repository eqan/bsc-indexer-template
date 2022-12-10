import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateOrdersInput } from './dto/create-orders.input';
import { DeleteOrderInput } from './dto/delete-orders.input';
import { FilterOrderDto } from './dto/filter.orders.dto';
import { GetAllOrders } from './dto/get-all-orders.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { Orders } from './entities/orders.entity';
import { OrdersService } from './orders.service';

@Resolver(() => Orders)
// export class OrdersResolver extends BaseProvider<Orders | FilterOrderDto> {
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {
    // super();
  }

  /**
   * Create Order
   * @param createOrdersInput
   * @returns Orders
   */
  @Mutation(() => Orders, { name: 'CreateOrder' })
  async create(
    @Args('CreateOrderInput') createOrdersInput: CreateOrdersInput,
  ): Promise<{ name: string } | Orders> {
    try {
      return await this.ordersService.create(createOrdersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Order
   * @param deleteOrderInput
   * @returns void
   */
  @Mutation(() => Orders, { name: 'DeleteOrder', nullable: true })
  async delete(
    @Args('DeleteOrderInput')
    deleteOrderInput: DeleteOrderInput,
  ): Promise<void> {
    try {
      await this.ordersService.delete(deleteOrderInput);
      return null;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Order Status
   * @param updateOrderStatus
   * @returns Updated Order
   */
  @Mutation(() => Orders, { name: 'UpdateOrder' })
  async edit(
    @Args('UpdateOrderInput')
    updateOrderStatus: UpdateOrderStatus,
  ): Promise<Orders> {
    try {
      return await this.ordersService.update(updateOrderStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Order By Id
   * @param orderId
   * @returns Order against specific id
   */
  @Query(() => Orders, { name: 'GetOrderById' })
  async show(@Args('orderId') orderId: string): Promise<Orders> {
    try {
      return await this.ordersService.show(orderId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Orders
   * @param filterOrderDto
   * @returns Searched or all orders
   */
  @Query(() => GetAllOrders, { name: 'GetAllOrders' })
  async index(
    @Args('FilterOrderInput', { nullable: true, defaultValue: {} })
    filterOrderDto: FilterOrderDto,
  ): Promise<GetAllOrders> {
    try {
      return await this.ordersService.index(filterOrderDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
