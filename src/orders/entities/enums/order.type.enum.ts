import { registerEnumType } from '@nestjs/graphql';

export enum OrderType {
  BEP20 = 'ERC20',
  BEP721 = 'ERC721',
  BEP1155 = 'ERC1155',
}

registerEnumType(OrderType, {
  name: 'OrderTypeEnum',
});
