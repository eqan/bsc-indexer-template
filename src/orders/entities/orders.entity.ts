import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Asset } from '../dto/nestedObjectsDto/asset-type.dto';
import { CustomDataScalar } from '../dto/nestedObjectsDto/data.dto';
import { OrderKind } from './enums/order.kind.enum';
import { ORDER_TYPES } from './enums/order.order-types.enum';
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
  })
  fill: number;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enumName: 'OrderKind',
    enum: OrderKind,
    default: OrderKind.SINGLE_TOKEN,
  })
  kind?: OrderKind;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    // nullable: true,
    enumName: 'ORDER_TYPES',
    enum: ORDER_TYPES,
    default: ORDER_TYPES.V2,
  })
  type: ORDER_TYPES;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    // nullable: true,
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status?: OrderStatus;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: false,
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
    nullable: false,
  })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  lastUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: false,
  })
  maker: string;

  @Field(() => Asset)
  @Column({
    type: 'jsonb',
  })
  make: {
    value: string;
    valueDecimal?: string;
    assetType: JSON;
  };

  @Field(() => Asset, { nullable: true })
  @Column({
    type: 'jsonb',
  })
  take: {
    value: string;
    valueDecimal?: string;
    assetType: JSON;
  };

  @Field({ nullable: true })
  @Column({
    type: 'text',
  })
  salt: string;

  // @Field(() => CustomAssetScalar)
  // assetType: JSON;
  // @ValidateNested()
  @Field(() => CustomDataScalar)
  @Column({
    type: 'json',
    nullable: false,
  })
  data: JSON;
  // data: OrderRaribleV2Data;
  // data: {
  //   type: string;
  //   nullable: true;
  //   // nullable: true;
  //   // payouts?: number[];
  //   originFees?: {
  //     account: string;
  //     value: number;
  //   };
  // };

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  start?: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  end?: Date;

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
  makePriceUsd?: number;

  @Field({ nullable: true })
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsd?: number;

  @Field({ nullable: true })
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
}
