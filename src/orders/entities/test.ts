import { Field, InputType, ObjectType } from '@nestjs/graphql';
import Ajv from 'ajv';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import { AssetTypeEnum } from 'src/graphqlFile';

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

export const CustomTestScalar = new GraphQLScalarType({
  name: 'TEST_SCALAR',
  description: 'A simple Test Parser',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  //   parseLiteral: (value, ast, variables) =>
  //     parseLiteral('JSON', ast, variables, value),
});

@ObjectType('Test')
@InputType('TestInput')
export class Test {
  @IsString()
  @Field()
  value: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  valueDecimal?: string;

  @ValidateNested()
  @Field(() => CustomTestScalar)
  assetType: JSON;
}
