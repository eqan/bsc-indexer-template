import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { Asset } from '../dto/nestedObjectsDto/asset-type.dto';
import { CustomDataScalar } from '../dto/nestedObjectsDto/data.dto';
import { AssetTypeTypes } from './assetType.constants';
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
  })
  fill: number;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    // nullable: true,
    enumName: 'OrderStatus',
    enum: OrderStatus,
    default: OrderStatus.Active,
  })
  status: OrderStatus;

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
  Make: {
    value: string;
    valueDecimal?: string;
    assetType: AssetTypeTypes;
  };

  @Field(() => Asset, { nullable: true })
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

  @Field({ nullable: true })
  @Column({
    type: 'text',
  })
  salt: string;

  // @Field(() => CustomAssetScalar)
  // assetType: JSON;
  // @ValidateNested()
  @Field(() => CustomDataScalar)
  Data: JSON;
  @Column({
    type: 'json',
    nullable: false,
  })
  data: {
    type: string;
    nullable: true;
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

  @Field({ nullable: true })
  @Column({
    type: 'float',
    nullable: true,
  })
  takePriceUsed?: number;

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
