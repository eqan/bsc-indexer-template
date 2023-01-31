import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateOrdersInput } from './dto/create-orders.input';
import { DeleteOrderInput } from './dto/delete-orders.input';
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
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Orders, { name: 'CreateOrder' })
  async create(
    @Args('CreateOrderInput') createOrdersInput: CreateOrdersInput,
  ): Promise<Orders> {
    try {
      return await this.ordersService.create(createOrdersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Create Order
   * @param OrderFormDto
   * @returns Orders
   */
  @Mutation(() => Boolean, { name: 'puting' })
  async puting(
    @Args('orderFormDto') orderFormDto: OrderFormDto,
  ): Promise<Orders> {
    try {
      return await this.ordersService.upsert(orderFormDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // upsertOrder(form: OrderFormDto): Promise<Orders> {
  //   // val order = orderService.put(form)
  //   // val result = orderDtoConverter.convert(order)
  //   // return ResponseEntity.ok(result)
  // }

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

  /**
   * Get ALL BIDS BY MAKERS
   * @param getOrderBidsByMakerDto
   * @returns Orders[]
   */
  @Query(() => [Orders], { name: 'GetOrderBidsByMaker' })
  async orderBidsByMaker(
    @Args('OrderBidsByMakerInput', { nullable: true, defaultValue: {} })
    getOrderBidsByMakerDto: GetOrderBidsByMakerDto,
  ): Promise<Orders[]> {
    try {
      return await this.ordersService.getOrderBidsByMaker(
        getOrderBidsByMakerDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Sell Orders By Maker
   * @param getSellOrdersByMakerDto
   * @returns Orders[]
   */
  @Query(() => [Orders], { name: 'GetSellOrdersByMaker' })
  async sellOrdersByMaker(
    @Args('SellOrdersByMakerInput', { nullable: true, defaultValue: {} })
    getSellOrdersByMakerDto: GetSellOrdersByMakerDto,
  ): Promise<Orders[]> {
    try {
      return await this.ordersService.getSellOrdersByMaker(
        getSellOrdersByMakerDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALL BIDS BY ITEM ID
   * @param getOrderBidsByItemDto
   * @returns Orders[]
   */
  @Query(() => [Orders], { name: 'GetOrderBidsByItem' })
  async orderBidsByItem(
    @Args('OrderBidsByItemInput', { nullable: true, defaultValue: {} })
    getOrderBidsByItemDto: GetOrderBidsByItemDto,
  ): Promise<Orders[]> {
    try {
      return await this.ordersService.getOrderBidsByItem(getOrderBidsByItemDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   *  Get All Sell Orders By ItemId
   * @param getSellOrdersByItemDto
   * @returns Orders[]
   */
  @Query(() => [Orders], { name: 'GetSellOrdersByItem' })
  async sellOrdersByItem(
    @Args('SellOrdersByItemInput', { nullable: true, defaultValue: {} })
    getSellOrdersByItemDto: GetSellOrdersByItemDto,
  ): Promise<Orders[]> {
    try {
      return await this.ordersService.getSellOrdersByItem(
        getSellOrdersByItemDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET ALL SELL ORDERS
   * @param getSellOrdersDto
   * @returns GetAllSellOrders
   */
  @Query(() => GetAllSellOrders, { name: 'GetSellOrders' })
  async sellOrders(
    @Args('SellOrdersInput', { nullable: true, defaultValue: {} })
    getSellOrdersDto: GetSellOrdersDto,
  ): Promise<GetAllSellOrders> {
    try {
      return await this.ordersService.getSellOrders(getSellOrdersDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
