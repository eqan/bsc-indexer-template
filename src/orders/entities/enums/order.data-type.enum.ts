import { registerEnumType } from '@nestjs/graphql';

export enum DataTypeEnum {
  RARIBLE_V2_DATA_V1 = 'RARIBLE_V2_DATA_V1',
  RARIBLE_V2_DATA_V2 = 'RARIBLE_V2_DATA_V2',
  RARIBLE_V2_DATA_V3_BUY = 'RARIBLE_V2_DATA_V3_BUY',
  RARIBLE_V2_DATA_V3_SELL = 'RARIBLE_V2_DATA_V3_SELL',
}

registerEnumType(DataTypeEnum, {
  name: 'DataTypeEnum',
});
