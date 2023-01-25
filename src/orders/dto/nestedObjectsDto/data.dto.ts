import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { PartDto } from 'src/core/dto/part.dto';

export enum DataTypeEnum {
  V2 = 'V2',
  ETH_RARIBLE_V2 = 'ETH_RARIBLE_V2',
  V3_SELL = 'V3_SELL',
  V3_BUY = 'V3_BUY',
}
registerEnumType(DataTypeEnum, {
  name: 'DataTypeEnum',
  description: 'DataType Enum',
});

@ObjectType('V2Type')
@InputType('V2Type')
export class V2Type {
  @Field(() => DataTypeEnum, { defaultValue: DataTypeEnum.V2 })
  @Type(() => () => DataTypeEnum.V2)
  readonly dataClass: DataTypeEnum.V2;

  @Field(() => [PartDto])
  payouts: PartDto[];

  @Field(() => [PartDto])
  originFees: PartDto[];

  @Field(() => Boolean)
  isMakeFill: boolean;
}

@ObjectType('ETH_RARIBLE_V2')
@InputType('ETH_RARIBLE_V2')
export class ETH_RARIBLE_V2_Type {
  @Field(() => DataTypeEnum, { defaultValue: DataTypeEnum.ETH_RARIBLE_V2 })
  @Type(() => () => DataTypeEnum.ETH_RARIBLE_V2)
  readonly dataClass: DataTypeEnum.ETH_RARIBLE_V2;

  @Field(() => [PartDto])
  payouts: PartDto[];

  @Field(() => [PartDto])
  originFees: PartDto[];
}

@ObjectType('V3SellType')
@InputType('V3SellType')
export class V3SellType {
  @Field(() => DataTypeEnum, { defaultValue: DataTypeEnum.V3_SELL })
  @Type(() => () => DataTypeEnum.V3_SELL)
  readonly dataClass: DataTypeEnum.V3_SELL;

  @Field(() => PartDto, { nullable: true })
  payout?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesFirst?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesSecond?: PartDto;

  @Field(() => Number)
  maxFeesBasePoint: number;

  @Field(() => String, { nullable: true })
  marketPlaceMarker?: string;
}

@ObjectType('V3BuyType')
@InputType('V3BuyType')
export class V3BuyType {
  @Field(() => DataTypeEnum, { defaultValue: DataTypeEnum.V3_BUY })
  @Type(() => () => DataTypeEnum.V3_BUY)
  readonly dataClass: DataTypeEnum.V3_BUY;

  @Field(() => PartDto, { nullable: true })
  payout?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesFirst?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesSecond?: PartDto;

  @Field(() => Number, { nullable: true })
  maxFeesBasePoint?: number;

  @Field(() => [PartDto], { nullable: true })
  payouts?: PartDto[];

  @Field(() => [PartDto], { nullable: true })
  originFees?: PartDto[];

  @Field(() => Boolean, { nullable: true })
  isMakeFill?: boolean;

  @Field(() => String, { nullable: true })
  marketPlaceMarker?: string;
}

export type DataType = V2Type | ETH_RARIBLE_V2_Type | V3SellType | V3BuyType;

@InputType('DataTypeInput')
export class DataTypeInput {
  @Field(() => DataTypeEnum)
  type: DataTypeEnum;

  @Field(() => DataTypeEnum)
  dataClass: DataTypeEnum;

  @Field(() => PartDto, { nullable: true })
  payout?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesFirst?: PartDto;

  @Field(() => PartDto, { nullable: true })
  originFeesSecond?: PartDto;

  @Field(() => Number, { nullable: true })
  maxFeesBasePoint?: number;

  @Field(() => String, { nullable: true })
  marketPlaceMarker?: string;

  @Field(() => [PartDto], { nullable: true })
  payouts?: PartDto[];

  @Field(() => [PartDto], { nullable: true })
  originFees?: PartDto[];

  @Field(() => Boolean, { nullable: true })
  isMakeFill?: boolean;
}

@ObjectType('DataDto')
@InputType('DataDto')
export class DataDto {
  @Field(() => DataTypeInput)
  @Type(() => DataTypeInput, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: V2Type, name: DataTypeEnum.V2 },
        { value: ETH_RARIBLE_V2_Type, name: DataTypeEnum.ETH_RARIBLE_V2 },
        { value: V3BuyType, name: DataTypeEnum.V3_BUY },
        { value: V3SellType, name: DataTypeEnum.V3_SELL },
      ],
    },
  })
  dataType: DataType;
}
