import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Data } from '../dto/nestedObjectsDto/data.object';
import { Make } from '../dto/nestedObjectsDto/make.dto';
import { OrderType } from './enums/order.type.enum';
import { OrderStatus } from './enums/orders.status.enum';

@ObjectType()
@Entity('Orders')
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
  })
  fill: number;

  @Field()
  @Column({
    type: 'enum',
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status: OrderStatus;

  @Field()
  @Column({
    type: 'int',
    nullable: false,
  })
  makeStock: number;

  @Field()
  @Column({
    type: 'boolean',
    nullable: false,
  })
  cancelled: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'text',
    nullable: false,
  })
  maker: string;

  @Field(() => Make)
  @Column({
    type: 'jsonb',
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
    nullable: false,
  })
  salt: string;

  @Field(() => Data)
  @Column({
    type: 'json',
    nullable: false,
  })
  data: {
    type: string;
    // payouts?: number[];
    originFees?: {
      account: string;
      value: number;
    };
  };

  @Field()
  @Column({
    type: 'timestamptz',
  })
  startedAt?: Date;

  @Field()
  @Column({
    type: 'timestamptz',
  })
  endedAt?: Date;

  @Field()
  @Column({
    type: 'boolean',
  })
  optionalRoyalties?: boolean;

  @Field()
  @Column({
    type: 'timestamptz',
  })
  dbUpdatedAt?: Date;

  @Field()
  @Column({
    type: 'decimal',
  })
  makePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
  })
  takePrice?: number;

  @Field()
  @Column({
    type: 'decimal',
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
