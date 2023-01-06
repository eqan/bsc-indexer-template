import { registerEnumType } from '@nestjs/graphql';

export enum OrderKind {
  SINGLE_TOKEN = 'single-token',
  CONTRACT_WIDE = 'contract-wide',
}

registerEnumType(OrderKind, {
  name: 'OrderKind',
});
