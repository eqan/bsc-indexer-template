// export declare type OrderRaribleV2Data =
//   | OrderRaribleV2DataV1
//   | OrderRaribleV2DataV2
//   | OrderRaribleV2DataV3Sell
//   | OrderRaribleV2DataV3Buy;

import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { ORDER_DATA_TYPES } from '../entities/enums/order.data-type.enum';

@Entity()
@TableInheritance({
  column: { type: 'enum', enum: ORDER_DATA_TYPES, name: 'dataType' },
})
export class OrderRaribleV2Data {
  @Column({
    type: 'enum',
    enum: ORDER_DATA_TYPES,
    default: ORDER_DATA_TYPES.V2,
  })
  // @Field({ nullable: true })
  readonly dataType!: ORDER_DATA_TYPES;
}

export class Part {
  @Column({ type: 'string' })
  account: string;
  @Column({ type: 'number' })
  value: number;
}

// @ChildEntity(ORDER_DATA_TYPES.V1)
// export class OrderRaribleV2DataV1 extends OrderRaribleV2Data {
//   @Column({ name: 'payouts', type: 'jsonb' })
//   payouts: Part[];

//   // payouts: Part[],
//   @Column({ name: 'originFees', type: 'jsonb' })
//   originFees: Part[];
// }

@ChildEntity(ORDER_DATA_TYPES.V2)
export class OrderRaribleV2DataV2 extends OrderRaribleV2Data {
  @Column({ name: 'payouts', type: 'jsonb' })
  payouts: Part[];
  @Column({ name: 'originFees', type: 'jsonb' })
  originFees: Part[];
  @Column({ name: 'isMakeFill', type: 'boolean' })
  isMakeFill: boolean;
}

@ChildEntity(ORDER_DATA_TYPES.V3_SELL)
export class OrderRaribleV2DataV3Sell extends OrderRaribleV2Data {
  @Column({ name: 'payout', type: 'jsonb', nullable: true })
  payout?: Part;
  @Column({ name: 'originFeeFirst', type: 'jsonb', nullable: true })
  originFeeFirst?: Part;
  @Column({ name: 'originFeeSecond', type: 'jsonb', nullable: true })
  originFeeSecond?: Part;
  @Column({ name: 'maxFeesBasePoint', type: 'number' })
  maxFeesBasePoint: number;
  @Column({ name: 'marketplaceMarker', type: 'jsonb', nullable: true })
  marketplaceMarker?: string;
}

@ChildEntity(ORDER_DATA_TYPES.V3_BUY)
export class OrderRaribleV2DataV3Buy extends OrderRaribleV2Data {
  @Column({ name: 'payout', type: 'jsonb', nullable: true })
  payout?: Part;
  @Column({ name: 'originFeeFirst', type: 'jsonb', nullable: true })
  originFeeFirst?: Part;
  @Column({ name: 'originFeeSecond', type: 'jsonb', nullable: true })
  originFeeSecond?: Part;
  @Column({ name: 'marketplaceMarker', type: 'jsonb', nullable: true })
  marketplaceMarker?: string;
}
