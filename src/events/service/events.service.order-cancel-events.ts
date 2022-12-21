import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderCancelEventInput } from '../dto/events.dto.order-cancel-events';
import { OrderCancelEvents } from '../entities/events.entity.order-cancel-events';

@Injectable()
export class OrderCancelEventService {
  constructor(
    @InjectRepository(OrderCancelEvents)
    private orderCancelEventRepo: Repository<OrderCancelEvents>,
  ) {}

  /**
   * Create OrderCancelEvent in DB
   * @params createOrderCancelInput
   * @returns OrderCancelEvent
   */
  async create(
    createOrderCancelEventInput: OrderCancelEventInput,
  ): Promise<OrderCancelEvents> {
    try {
      const CancelEvent = this.orderCancelEventRepo.create(
        createOrderCancelEventInput,
      );
      return await this.orderCancelEventRepo.save(CancelEvent);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //   /**
  //    * Get All Collections ... With Filters
  //    * @@params No Params
  //    * @returns Array of Collections and Total Number of Collections
  //    */
  //   async index(filterActivity: FilterActivityDto): Promise<GetAllActivities> {
  //     try {
  //       const { page = 1, limit = 20, ...rest } = filterActivity;
  //       const [items, total] = await Promise.all([
  //         this.orderCancelEventsRepo.find({
  //           where: {
  //             id: rest?.id,
  //             type: rest?.type,
  //             userId: rest?.userId,
  //             collectionId: rest?.collectionId,
  //             itemId: rest?.itemId,
  //           },
  //           relations: {
  //             BID: true,
  //             MINT: true,
  //             TRANSFER: true,
  //             BURN: true,
  //           },
  //           skip: (page - 1) * limit || 0,
  //           take: limit || 10,
  //         }),
  //         this.orderCancelEventsRepo.count({
  //           where: {
  //             id: rest?.id,
  //             type: rest?.type,
  //             userId: rest?.userId,
  //             collectionId: rest?.collectionId,
  //             itemId: rest?.itemId,
  //           },
  //         }),
  //       ]);
  //       return { items, total };
  //     } catch (err) {
  //       throw new BadRequestException(err);
  //     }
  //   }

  /**
   * GET Activity By Id
   * @param id
   * @returns Activity against Provided Id
   */
  //   async show(id: string): Promise<Activity> {
  //     try {
  //       const found = await this.orderCancelEventsRepo.findOneBy({
  //         id,
  //       });
  //       if (!found) {
  //         throw new NotFoundException(`Activity against ${id} not found`);
  //       }
  //       return found;
  //     } catch (error) {
  //       throw new BadRequestException(error);
  //     }
  //   }

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
  //       const values = await this.orderCancelEventsRepo.delete({ id: In(ids) });
  //       if (!values) {
  //         throw new NotFoundException('Activity not found');
  //       }
  //       return null;
  //     } catch (error) {
  //       throw new BadRequestException(error);
  //     }
  //   }
}
