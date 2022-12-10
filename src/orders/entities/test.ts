import { Field, InputType, ObjectType } from '@nestjs/graphql';
import Ajv from 'ajv';
import { ValidateNested } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import { AssetTypeEnum } from './enums/orders.asset-type.enum';

function validate(value: unknown): object | never {
  if (typeof value !== 'object') {
    throw new Error('invalid input type');
  }

  const schema = {
    discriminator: 'assetClass',
    mapping: {
      [AssetTypeEnum.ETH]: {
        properties: {
          //   assetClass: { type: 'string' },
        },
      },
      [AssetTypeEnum.ERC20]: {
        properties: {
          contract: { type: 'string' },
        },
      },
      [AssetTypeEnum.ERC721]: {
        properties: {
          contract: { type: 'string' },
          tokenId: { type: 'number' },
        },
      },
      [AssetTypeEnum.ERC1155]: {
        properties: {
          contract: { type: 'string' },
          tokenId: { type: 'number' },
        },
      },
    },
  };

  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(value);
  if (!valid) console.log(validate.errors);
  return value;
}

export const CustomAssetScalar = new GraphQLScalarType({
  name: 'TEST_SCALAR',
  description: 'A simple Test Parser',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  //   parseLiteral: (value, ast, variables) =>
  //     parseLiteral('JSON', ast, variables, value),
});

@ObjectType('AssetType')
@InputType('AssetTypeInput')
export class AssetType {
  @ValidateNested()
  @Field(() => CustomAssetScalar)
  assetType: JSON;
}
