import { registerEnumType } from '@nestjs/graphql';

// export enum ORDER_DATA_TYPES {
//   DEFAULT_DATA_TYPE = '0xffffffff',
//   LEGACY = 'LEGACY',
//   V1 = 'V1',
//   API_V1 = 'ETH_RARIBLE_V1',
//   V2 = 'V2',
//   API_V2 = 'ETH_RARIBLE_V2',
//   V3_SELL = 'V3_SELL',
//   API_V3_SELL = 'ETH_RARIBLE_V2_DATA_V3_SELL',
//   V3_BUY = 'V3_BUY',
//   API_V3_BUY = 'ETH_RARIBLE_V2_DATA_V3_BUY',
// }

export enum ORDER_DATA_TYPES {
  // V1 = 'V1',
  V2 = 'V2',
  V3_BUY = 'V3_BUY',
  V3_SELL = 'V3_SELL',
  ETH_RARIBLE_V2 = 'ETH_RARIBLE_V2',
  // LEGACY = 'LEGACY',
}

registerEnumType(ORDER_DATA_TYPES, {
  name: 'ORDER_DATA_TYPES',
});
