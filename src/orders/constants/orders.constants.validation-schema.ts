import { BadRequestException } from '@nestjs/common';
import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { AssetClassEnum } from '../entities/enums/orders.asset-class.enum';
import { PartDto as Part } from 'src/core/dto/part.dto';

//graphql union type field validation schema using ajv
// const Part = {
//   type: 'object',
//   properties: {
//     account: { type: 'string' },
//     value: { type: 'number' },
//   },
//   additionalProperties: false,
//   required: ['account', 'value'],
//   errorMessage:
//     'Object must be of required type { account:string, value:number }',
// };

enum DataType {
  // V1 = 'V1',
  V2 = 'V2',
  ETH_RARIBLE_V2 = 'ETH_RARIBLE_V2',
  V3_SELL = 'V3_SELL',
  V3_BUY = 'V3_BUY',
}

export const dataValidationSchema = {
  type: 'object',
  discriminator: { propertyName: 'dataType' },
  required: ['dataType'],
  oneOf: [
    // {
    //   properties: {
    //     dataType: { enum: ['V1'] },
    //     payouts: {
    //       type: 'array',
    //       items: Part,
    //     },
    //     originFees: { type: 'array', items: Part },
    //   },
    //   additionalProperties: false,
    //   required: ['payouts', 'originFees'],
    //   errorMessage:
    //     'V1 must be of type { payouts:[Part], originFees:Part } where Part {account:string,value:number}',
    // },
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
      errorMessage:
        'V2 must be of type { payouts:[Part], originFees:Part, isMakeFill:boolean } where Part {account:string,value:number}',
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
      errorMessage:
        'ETH_RARIBLE_V2 must be of type { payouts:[Part], originFees:Part } where Part {account:string,value:number}',
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
      errorMessage:
        'V3_SELL  must be of type { payout?:Part, originFeeFirst?:Part, originFeeSecond?:Part, maxFeesBasePoint:number, marketplaceMarker:string } where Part {account:string,value:number}',
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
      errorMessage:
        'V3_BUY must be of type { payout?:Part, originFeeFirst?:Part, originFeeSecond?:Part, maxFeesBasePoint?:number, marketplaceMarker?:string } where Part {account:string,value:number}',
    },
  ],
  errorMessage: `should have property dataType oneOf Enum type [${Object.values(
    DataType,
  )}]`,
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
      errorMessage: 'ETH type should not have any additional property',
    },
    {
      properties: {
        assetClass: { enum: ['ERC20'] },
        contract: { type: 'string' },
      },
      additionalProperties: false,
      required: ['contract'],
      errorMessage:
        'type ERC20 must have required property contract of type string',
    },
    {
      properties: {
        assetClass: { enum: ['ERC721', 'ERC1155'] },
        contract: { type: 'string' },
        tokenId: { type: 'string' },
      },
      additionalProperties: false,
      errorMessage:
        'must have required properties contract of type string and tokenId of type string',
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
        signatures: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
      errorMessage:
        'type ERC721_LAZY must be of type { contract:string, tokenId:string, uri:string, creators?:[Part] royalties?:[Part] signatures:[string] } where Part {account:string,value:number}',
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
        signatures: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
      errorMessage:
        'type ERC1155_LAZY must be of type { contract:string, tokenId:string, supply:number, uri:string, creators?:[Part] royalties?:[Part] signatures:[string] } where Part {account:string,value:number}',
      required: ['contract', 'tokenId', 'uri', 'supply', 'signatures'],
    },
  ],
  errorMessage: `should have property assetClass oneOf Enum type [${Object.values(
    AssetClassEnum,
  )}]`,
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
    allErrors: true,
    discriminator: true,
  });
  ajvErrors(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(data);
  console.log(validate.errors);

  if (!valid) throw new BadRequestException(validate.errors[0]);
  return data;
};
