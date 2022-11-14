import { registerEnumType } from '@nestjs/graphql';

export enum TokenType {
  BEP721 = 'BEP721',
  BEP1155 = 'BEP1155'
}

registerEnumType(TokenType, {
  name: 'TokenType',
  description: 'Types of tokens'
});
