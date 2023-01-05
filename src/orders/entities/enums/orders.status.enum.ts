import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  FILLED = 'FILLED',
  HISTORICAL = 'HISTORICAL',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
