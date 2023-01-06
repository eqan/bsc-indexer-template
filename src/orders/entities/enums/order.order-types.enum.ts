import { registerEnumType } from '@nestjs/graphql';

export enum ORDER_TYPES {
  V1 = 'RARIBLE_V1',
  V2 = 'RARIBLE_V2',
}

registerEnumType(ORDER_TYPES, {
  name: 'ORDER_TYPES',
});
