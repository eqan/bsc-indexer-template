import { ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderSide } from '../enums/events.enums.order-side';
import { BaseEventParams } from './entities.entity.base-event-params';

// export type Event = {
//   // OrderSide: OrderSide;
//   orderId?: string;
//   orderSide: 'buy' | 'sell';
//   maker: string;
//   taker: string;
//   price: string;
//   contract: string;
//   tokenId: string;
//   amount: string;
//   currency: string;
//   currencyPrice?: string;
//   usdPrice?: string;
//   baseEventParams: BaseEventParams;
// };

@ObjectType()
@Entity('OrderMatchEvent')
export class OrderMatchEvent extends BaseEntity {
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  orderId: string;

  @Column({
    type: 'enum',
    enumName: 'OrderSide',
    enum: OrderSide,
    default: OrderSide.sell,
    nullable: false,
  })
  orderSide: OrderSide;

  @Column({
    type: 'text',
    nullable: false,
  })
  maker: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  taker: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  price: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  contract: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  tokenId: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  amount: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  currency: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  currencyPrice?: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  usdPrice?: string;

  @OneToOne(() => BaseEventParams, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  baseEventParams?: BaseEventParams;
}
