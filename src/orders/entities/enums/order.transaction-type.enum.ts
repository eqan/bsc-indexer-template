import { registerEnumType } from '@nestjs/graphql';

/**
 * enum to keep record of order availibilty
 * offchain and onchain
 */
export enum OrderTransaction {
  SELL_ORDER = 'SELL_ORDER',
  BID_ORDER = 'BID_ORDER',
}

registerEnumType(OrderTransaction, {
  name: 'OrderTransaction',
});
