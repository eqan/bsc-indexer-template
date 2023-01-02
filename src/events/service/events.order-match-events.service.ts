import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderMatchEventInput } from '../dto/events.dto.order-match-events';
import { OrderMatchEvents } from '../entities/events.entity.order-match-events';

@Injectable()
export class OrderMatchEventService {
  constructor(
    @InjectRepository(OrderMatchEvents)
    private orderMatchEventRepo: Repository<OrderMatchEvents>,
  ) {}

  /**
   * Create OrderMatchEvent in DB
   * @params createOrderMatchInput
   * @returns OrderMatchEvent
   */
  async create(
    createOrderMatchInput: OrderMatchEventInput,
  ): Promise<OrderMatchEvents> {
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
   * GET MatchEvent by orderId
   * @param id
   * @returns MatchEvent against provided OrderId
   */
  async show(orderId: string): Promise<OrderMatchEvents> {
    try {
      const found = await this.orderMatchEventRepo.findOneBy({
        orderId,
      });
      if (!found) {
        throw new NotFoundException(`MatchEvent against ${orderId} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
