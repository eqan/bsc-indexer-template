import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { BaseEventParams } from './entities.entity.base-event-params';

// @ObjectType('')
@Entity('OrderCancelEvents')
export abstract class OrderCancelEvents extends BaseEntity {
  // @Field()
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

  // @Field(() => OrderType, { nullable: true })
  // @Column({
  //   enum: OrderType,
  //   default: OrderType.BEP20,
  //   nullable: true,
  // })
  // type?: OrderType;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'timestamptz',
  //   nullable: true,
  //   default: () => 'NOW()',
  // })
  // date: Date;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'int',
  //   nullable: true,
  // })
  // logIndex: number;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'int',
  //   nullable: true,
  // })
  // transactionIndex: number;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'varchar',
  //   nullable: true,
  // })
  // transactionHash: string;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'varchar',
  //   nullable: true,
  // })
  // blockHash: string;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'int',
  //   nullable: true,
  // })
  // blockIndex: number;

  // @Field({ nullable: true })
  // @Column({
  //   type: 'varchar',
  //   nullable: true,
  // })
  // address: string;
}
