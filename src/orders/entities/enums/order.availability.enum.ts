import { registerEnumType } from '@nestjs/graphql';

/**
 * enum to keep record of order availibilty
 * offchain and onchain
 */
export enum OrderAvailability {
  OFF_CHAIN = 'off-chain',
  ON_CHAIN = 'on-chain',
}

registerEnumType(OrderAvailability, {
  name: 'OrderAvailability',
});
