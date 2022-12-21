import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderMatchEventInput } from '../dto/events.dto.order-match-events';
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

  //   /**
  //    * Get All Collections ... With Filters
  //    * @@params No Params
  //    * @returns Array of Collections and Total Number of Collections
  //    */
  //   async index(filterActivity: FilterActivityDto): Promise<GetAllActivities> {
  //     try {
  //       const { page = 1, limit = 20, ...rest } = filterActivity;
  //       const [items, total] = await Promise.all([
  //         this.orderMatchEventsRepo.find({
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
  //         this.orderMatchEventsRepo.count({
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
  //       const found = await this.orderMatchEventsRepo.findOneBy({
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
