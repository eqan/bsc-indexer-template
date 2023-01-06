import { BadRequestException } from '@nestjs/common';
import Ajv from 'ajv';
//graphql union type field validation schema using ajv
const Part = {
  type: 'object',
  properties: {
    account: { type: 'string' },
    value: { type: 'number' },
  },
  additionalProperties: false,
  required: ['account', 'value'],
};

enum DataType {
  V1 = 'V1',
  V2 = 'V2',
  ETH_RARIBLE_V2 = 'ETH_RARIBLE_V2',
  V3_SELL = 'V3_SELL',
  V3_BUY = 'V3_BUY',
}

export const dataValidationSchema = {
  type: 'object',
  discriminator: { propertyName: 'dataType' },
  required: ['dataType'],
  // errorMessage: 'should be an object with an integer property foo only',
  oneOf: [
    {
      properties: {
        dataType: { enum: ['V1'] },
        payouts: {
          type: 'array',
          items: Part,
        },
        originFees: { type: 'array', items: Part },
      },
      additionalProperties: false,
      required: ['payouts', 'originFees'],
      errorMessage: 'should be an object with an integer property foo only',
    },
    {
      properties: {
        dataType: { enum: ['V2'] },
        payouts: {
          type: 'array',
          items: Part,
        },
        originFees: { type: 'array', items: Part },
        isMakeFill: { type: 'boolean' },
      },
      additionalProperties: false,
      required: ['payouts', 'originFees', 'isMakeFill'],
      errorMessage: {
        // In here must be errorMessage not errorMessages
        type: 'foo must be an Integer', // Your Custom Error Message
      },
    },
    {
      properties: {
        dataType: { enum: ['ETH_RARIBLE_V2'] },
        payouts: {
          type: 'array',
          items: Part,
        },
        originFees: { type: 'array', items: Part },
      },
      additionalProperties: false,
      required: ['payouts', 'originFees'],
      errorMessage: 'should be an object with an integer property foo only',
    },
    {
      properties: {
        dataType: { enum: ['V3_SELL'] },
        payout: Part,
        originFeeFirst: Part,
        originFeeSecond: Part,
        maxFeesBasePoint: { type: 'number' },
        marketplaceMarker: { type: 'string' },
      },
      additionalProperties: false,
      required: ['maxFeesBasePoint'],
      errorMessage: 'should be an object with an integer property foo only',
    },
    {
      properties: {
        dataType: { enum: ['V3_BUY'] },
        payout: Part,
        originFeeFirst: Part,
        originFeeSecond: Part,
        maxFeesBasePoint: { type: 'number' },
        marketplaceMarker: { type: 'string' },
      },
      additionalProperties: false,
      errorMessage: 'should be an object with an integer property foo only',
    },
  ],
  errorMessages: {
    type: 'should be an object',
    required: `should have property dataType Enum of type ${Object.values(
      DataType,
    )}`,
    additionalProperties: 'should not have properties other than dataType',
  },
};

export const assetTypeValidationSchema = {
  type: 'object',
  discriminator: { propertyName: 'assetClass' },
  required: ['assetClass'],
  oneOf: [
    {
      properties: {
        assetClass: { enum: ['ETH'] },
      },
      additionalProperties: false,
    },
    {
      properties: {
        assetClass: { enum: ['ERC20'] },
        contract: { type: 'string' },
      },
      additionalProperties: false,
      required: ['contract'],
    },
    {
      properties: {
        assetClass: { enum: ['ERC721', 'ERC1155'] },
        contract: { type: 'string' },
        tokenId: { type: 'string' },
      },
      additionalProperties: false,
      required: ['contract', 'tokenId'],
    },
    {
      properties: {
        assetClass: { enum: ['ERC721_LAZY'] },
        contract: { type: 'string' },
        tokenId: { type: 'string' },
        uri: { type: 'string' },
        creators: { type: 'array', items: Part },
        royalties: { type: 'array', items: Part },
        signatures: { types: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
      required: ['contract', 'tokenId', 'uri', 'signatures'],
    },
    {
      properties: {
        assetClass: { enum: ['ERC1155_LAZY'] },
        contract: { type: 'string' },
        tokenId: { type: 'string' },
        uri: { type: 'string' },
        supply: { type: 'number' },
        creators: { type: 'array', items: Part },
        royalties: { type: 'array', items: Part },
        signatures: { types: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
      required: ['contract', 'tokenId', 'uri', 'supply', 'signatures'],
    },
  ],
};

/**
 * validate union type json schema
 * @param value json to validate
 * @param schema to match value with
 */

export const validate = (data: unknown, schema: any): object | never => {
  if (typeof data !== 'object') {
    throw new Error('invalid input type must be of type object');
  }
  const ajv = new Ajv({
    formats: {
      reserved: true,
    },
    allErrors: true,
  });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  // const output = betterAjvErrors(schema, data, validate.errors);
  if (!valid) throw new BadRequestException(validate.errors);
  // if (!valid) throw new BadRequestException(output);
  return data;
};
