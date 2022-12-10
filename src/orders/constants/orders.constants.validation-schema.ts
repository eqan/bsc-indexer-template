import * as Ajv from 'ajv';
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

export const dataValidationSchema = {
  type: 'object',
  discriminator: { propertyName: 'dataType' },
  required: ['dataType'],
  oneOf: [
    {
      properties: {
        dataType: { enum: ['RARIBLE_V2_DATA_V1'] },
        payouts: {
          type: 'array',
          items: Part,
        },
        originFees: { type: 'array', items: Part },
      },
      additionalProperties: false,
      required: ['payouts', 'originFees'],
    },
    {
      properties: {
        dataType: { enum: ['RARIBLE_V2_DATA_V2'] },
        payouts: {
          type: 'array',
          items: Part,
        },
        originFees: { type: 'array', items: Part },
        isMakeFill: { type: 'boolean' },
      },
      additionalProperties: false,
      required: ['payouts', 'originFees', 'isMakeFill'],
    },
    {
      properties: {
        dataType: { enum: ['RARIBLE_V2_DATA_V3_SELL'] },
        payout: Part,
        originFeeFirst: Part,
        originFeeSecond: Part,
        maxFeesBasePoint: { type: 'number' },
        marketplaceMarker: { type: 'string' },
      },
      additionalProperties: false,
      required: ['maxFeesBasePoint'],
    },
    {
      properties: {
        dataType: { enum: ['RARIBLE_V2_DATA_V3_BUY'] },
        payout: Part,
        originFeeFirst: Part,
        originFeeSecond: Part,
        maxFeesBasePoint: { type: 'number' },
        marketplaceMarker: { type: 'string' },
      },
      additionalProperties: false,
    },
  ],
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
  ],
};

/**
 * validate union type json schema
 * @param value json to validate
 * @param schema to match value with
 */

export const validate = (value: unknown, schema: any): object | never => {
  if (typeof value !== 'object') {
    throw new Error('invalid input type');
  }
  const ajv = new Ajv({
    formats: {
      reserved: true,
    },
    allErrors: true,
  });
  const validate = ajv.compile(schema);
  const valid = validate(value);
  if (!valid) throw new Error(validate.errors[0].message);
  return value;
};
