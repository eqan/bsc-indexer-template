import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Data } from '../dto/nestedObjectsDto/data.object';
import { Make } from '../dto/nestedObjectsDto/make.dto';
import { OrderType } from './enums/order.type.enum';
import { OrderStatus } from './enums/orders.status.enum';

@ObjectType()
@Entity('Orders')
@Index(['orderId', 'maker', 'taker'])
export class Orders {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  orderId: string;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  fill: number;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    nullable: true,
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status: OrderStatus;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  makeStock: number;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  cancelled: boolean;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  maker: string;

  @Field(() => Make, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  Make: {
    type: {
      type: OrderType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field(() => Make, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  take: {
    type: {
      type: OrderType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  salt: string;

  @Field(() => Data, { nullable: true })
  @Column({
    type: 'json',
    nullable: true,
  })
  data: {
    type: string;
    nullable: true;
    originFees?: {
      account: string;
      value: number;
    };
  };

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  startedAt?: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  endedAt?: Date;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
  })
  optionalRoyalties?: boolean;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  dbUpdatedAt?: Date;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  makePrice?: number;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  takePrice?: number;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  makePriceUsed?: number;

  @Field({ nullable: true })
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsed?: number;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  signature?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  taker?: string;
}
