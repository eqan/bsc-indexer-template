import { IsEthereumAddress } from 'class-validator';
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

@Entity('OrderMatchEvents')
export abstract class OrderMatchEvents extends BaseEntity {
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

  @IsEthereumAddress()
  @Column({
    type: 'text',
    nullable: false,
  })
  maker: string;

  @IsEthereumAddress()
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

  @IsEthereumAddress()
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

  @IsEthereumAddress()
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
