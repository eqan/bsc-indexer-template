import { registerEnumType } from '@nestjs/graphql';

export enum OrderTypesForPlatform {
  // V1 = 'RARIBLE_V1',
  V2 = 'RARIBLE_V2',
}

registerEnumType(OrderTypesForPlatform, {
  name: 'OrderTypesForPlatform',
});
