import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateOrdersInput } from './dto/create-orders.input';
import { DeleteOrderInput } from './dto/delete-orders.input';
import { FilterOrderDto } from './dto/filter.dto';
import { GetAllOrders } from './dto/get-all-orders.dto';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { Orders } from './entities/orders.entity';
import { OrdersService } from './orders.service';

@Resolver(() => Orders)
export class OrdersResolver extends BaseProvider<Orders | FilterOrderDto> {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }


  /**
   * Create Order
   * @param createOrdersInput 
   * @returns Orders
   */
  @Mutation(() => Orders, { name: 'CreateOrder' })
  async create(
    @Args('CreateOrderInput') createOrdersInput: CreateOrdersInput,
  ): Promise<Orders> {
    try {
      return await this.ordersService.createOrder(createOrdersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete Order
   * @param deleteOrderInput 
   * @returns void
   */
  @Mutation(() => Orders, { name: 'DeleteOrder' })
  async delete(
    @Args('Delete') deleteOrderInput: DeleteOrderInput,
  ): Promise<void> {
    try {
      return await this.ordersService.deleteOrder(deleteOrderInput);
    } catch (error) {}
  }

  /**
   * Update Order Status
   * @param updateOrderStatus
   * @returns Updated Order
   */
  @Mutation(() => Orders, { name: 'UpdateOrderStatus' })
  async edit(
    @Args('UpdateOrderStatus')
    updateOrderStatus: UpdateOrderStatus,
  ): Promise<Orders> {
    try {
      return await this.ordersService.updateOrderStatus(updateOrderStatus);
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
      return await this.ordersService.getOrderById(orderId);
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
    @Args('GetAllOrders') filterOrderDto: FilterOrderDto,
  ): Promise<GetAllOrders> {
    try {
      return await this.ordersService.findAllOrders(filterOrderDto);
    } catch (error) {}
  }
}
