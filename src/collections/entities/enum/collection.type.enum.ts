import { registerEnumType } from '@nestjs/graphql';

export enum CollectionType {
  BEP20 = 'BEP20',
  BEP721 = 'BEEP721',
  BEP1155 = 'BEP1155'
}

registerEnumType(CollectionType, {
  name: 'CollectionType',
  description: 'Types of tokens'
});
