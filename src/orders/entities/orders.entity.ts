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

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  fill: number;

  @Field()
  @Column({
    type: 'enum',
    nullable: true,
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status: OrderStatus;

  @Field()
  @Column({
    type: 'int',
    nullable: true,
  })
  makeStock: number;

  @Field()
  @Column({
    type: 'boolean',
    nullable: true,
  })
  cancelled: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  maker: string;

  @Field(() => Make)
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

  @Field(() => Make)
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

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  salt: string;

  @Field(() => Data)
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

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  startedAt?: Date;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  endedAt?: Date;

  @Field()
  @Column({
    type: 'boolean',
    nullable: true,
  })
  optionalRoyalties?: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  dbUpdatedAt?: Date;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  makePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  takePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  makePriceUsed?: number;

  @Field()
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsed?: number;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  signature?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  taker?: string;
}
