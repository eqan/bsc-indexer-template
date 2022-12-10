import { GraphQLScalarType } from 'graphql';
import {
  dataValidationSchema,
  validate,
} from 'src/orders/constants/orders.constants.validation-schema';

export const CustomDataScalar = new GraphQLScalarType({
  name: 'DATA_SCALAR',
  description: 'A simple Data Parser',
  serialize: (value) => validate(value, dataValidationSchema),
  parseValue: (value) => validate(value, dataValidationSchema),
});

// @ObjectType('Data')
// @InputType('DataInput')
// export class Data {
//   @IsString()
//   @Field()
//   type: string;

//   @ValidateNested()
//   @Type(() => DataOriginFee)
//   @Field(() => DataOriginFee, { nullable: true })
//   originFees?: DataOriginFee;
// }

// export declare type OrderRaribleV2Data =
//   | OrderRaribleV2DataV1
//   | OrderRaribleV2DataV2
//   | OrderRaribleV2DataV3Sell
//   | OrderRaribleV2DataV3Buy;
// export declare type OrderRaribleV2DataV1 = {
//   dataType: 'RARIBLE_V2_DATA_V1';
//   payouts: Array<Part>;
//   originFees: Array<Part>;
// };
// export declare type OrderRaribleV2DataV2 = {
//   dataType: 'RARIBLE_V2_DATA_V2';
//   payouts: Array<Part>;
//   originFees: Array<Part>;
//   isMakeFill: boolean;
// };
// export declare type OrderRaribleV2DataV3Sell = {
//   dataType: 'RARIBLE_V2_DATA_V3_SELL';
//   payout?: Part;
//   originFeeFirst?: Part;
//   originFeeSecond?: Part;
//   maxFeesBasePoint: number;
//   marketplaceMarker?: Word;
// };
// export declare type OrderRaribleV2DataV3Buy = {
//   dataType: 'RARIBLE_V2_DATA_V3_BUY';
//   payout?: Part;
//   originFeeFirst?: Part;
//   originFeeSecond?: Part;
//   marketplaceMarker?: Word;
// };
