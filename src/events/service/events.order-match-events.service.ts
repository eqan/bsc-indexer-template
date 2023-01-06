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
