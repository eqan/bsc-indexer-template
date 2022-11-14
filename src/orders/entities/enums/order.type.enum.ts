import { registerEnumType } from '@nestjs/graphql';

export enum OrderType {
  BEP20 = 'BEP20',
  BEP721 = 'BEP721',
  BEP1155 = 'BEP1155'
}

registerEnumType(OrderType, {
  name: 'OrderTypeEnum'
});
