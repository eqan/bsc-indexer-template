import { registerEnumType } from '@nestjs/graphql';

export enum OrderSide {
  buy = ' BUY',
  sell = 'SELL',
}

registerEnumType(OrderSide, {
  name: 'OrderSide',
});
