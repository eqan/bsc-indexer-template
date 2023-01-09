import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { BaseEventParams } from './entities.entity.base-event-params';

@Entity('OrderCancelEvents')
export abstract class OrderCancelEvents extends BaseEntity {
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  orderId: string;

  @OneToOne(() => BaseEventParams, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  baseEventParams?: BaseEventParams;
}
