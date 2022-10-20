import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Active = 'ACTIVE',
  Filled = 'FILLED',
  Historical = 'HISTORICAL',
  InActive = 'INACTIVE',
  Cancelled = 'CANCELLED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
