import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import {
  assetTypeValidationSchema,
  validate,
} from 'src/orders/constants/orders.constants.validation-schema';

export const CustomAssetScalar = new GraphQLScalarType({
  name: 'ASSET_SCALAR',
  description: 'A simple Asset Parser',
  serialize: (value) => validate(value, assetTypeValidationSchema),
  parseValue: (value) => validate(value, assetTypeValidationSchema),
});

@ObjectType('Asset')
@InputType('AssetInput')
export class Asset {
  @IsString()
  @Field()
  value: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  valueDecimal?: string;

  @ValidateNested()
  @Field(() => CustomAssetScalar)
  assetType: JSON;
}
