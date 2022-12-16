import { Field, ObjectType } from '@nestjs/graphql';
import { OrderType } from 'src/orders/entities/enums/order.type.enum';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType('EventsCancel')
@Entity('EventCancelInput')
export abstract class Activity extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  id: string;

  @Field(() => OrderType, { nullable: true })
  @Column({
    enum: OrderType,
    default: OrderType.BEP20,
    nullable: true,
  })
  type?: OrderType;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'NOW()',
  })
  date: Date;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  logIndex: number;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  transactionIndex: number;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  transactionHash: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  blockHash: string;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  blockIndex: number;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;
}
