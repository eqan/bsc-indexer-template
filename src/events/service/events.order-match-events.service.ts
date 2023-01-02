import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { OrderMatchEventInput } from '../dto/events.dto.order-match-events';
import { GetAllOrdersMatchEvent } from '../dto/get-all-activities.dto';
import { OrderMatchEvent } from '../entities/events.entity.order-match-events';

@Injectable()
export class OrderMatchEventService {
  constructor(
    @InjectRepository(OrderMatchEvent)
    private orderMatchEventRepo: Repository<OrderMatchEvent>,
  ) {}

  /**
   * Create OrderMatchEvent in DB
   * @params createOrderMatchInput
   * @returns OrderMatchEvent
   */
  async create(
    createOrderMatchInput: OrderMatchEventInput,
  ): Promise<OrderMatchEvent> {
    try {
      const matchEvent = this.orderMatchEventRepo.create(createOrderMatchInput);
      return await this.orderMatchEventRepo.save(matchEvent);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Collections ... With Filters
   * @@params No Params
   * @returns Array of Collections and Total Number of Collections
   */
  // async index(
  //   filterOrderMatchEvent: FilterOrderMatchEvent,
  // ): Promise<GetAllOrdersMatchEvent> {
  //   try {
  //     const { page = 1, limit = 20, ...rest } = filterOrderMatchEvent;
  //     const [items, total] = await Promise.all([
  //       this.orderMatchEventRepo.find({
  //         where: {
  //           orderId: rest?.orderId,
  //           tokenId: rest?.tokenId,
  //         },
  //         skip: (page - 1) * limit || 0,
  //         take: limit || 10,
  //       }),
  //       this.orderMatchEventRepo.count({
  //         where: {
  //           orderId: rest?.orderId,
  //           tokenId: rest?.tokenId,
  //         },
  //       }),
  //     ]);
  //     return { items, total };
  //   } catch (err) {
  //     throw new BadRequestException(err);
  //   }
  // }

  /**
   * GET Order By Id
   * @param id
   * @returns Order against Provided Id
   */
  async show(
    contract?: string,
    timestamp?: number,
  ): Promise<GetAllOrdersMatchEvent> {
    try {
      const [items, total] = await Promise.all([
        this.orderMatchEventRepo.find({
          where: {
            contract,
            baseEventParams: { timestamp: MoreThan(timestamp) },
          },
        }),
        this.orderMatchEventRepo.count({
          where: {
            contract,
            baseEventParams: { timestamp: MoreThan(timestamp) },
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //   /**
  //    * Edit Activity
  //    * @param activityId
  //    * @returns Updated Activity
  //    */
  //   edit(id: number) {
  //     return `This action updates a #${id} activity`;
  //   }

  /**
   * DEETE Activity
   * @param activityIds
   * @returns
   */
  //   async delete(deleteWithIds: { id: string[] }): Promise<void> {
  //     try {
  //       const ids = deleteWithIds.id;
  //       const values = await this.orderMatchEventsRepo.delete({ id: In(ids) });
  //       if (!values) {
  //         throw new NotFoundException('Activity not found');
  //       }
  //       return null;
  //     } catch (error) {
  //       throw new BadRequestException(error);
  //     }
  //   }
}
