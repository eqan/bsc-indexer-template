import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Data } from '../dto/nestedObjectsDto/data.object';
import { Make } from '../dto/nestedObjectsDto/make.dto';
import { AssetType } from './assetType';
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
    // nullable: true,
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

  @Field(() => )
  @Column({
    type: 'jsonb',
  })
  Make: {
    // assetType: {
    //   type: OrderType;
    //   contract: string;
    //   tokenId: number;
    // };
    assetType: AssetType;
    value: Address;
    valueDecimal?: number;
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
  })
  salt: string;

  @Field(() => Data)
  @Column({
    type: 'json',
    nullable: false,
  })
  data: {
    type: string;
    // nullable: true;
    // payouts?: number[];
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

  @Field()
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsed?: number;

  @Field()
  @Column({
    type: 'text',
  })
  signature: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  taker?: string;

  @Field()
  @Column({ type: 'text' })
  dataType: string;
}
