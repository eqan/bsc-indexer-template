import { Injectable } from '@nestjs/common';
import { utils } from 'ethers/lib';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { lowerCase } from 'src/common/utils.common';
import * as Addresses from '../constants/orders.constants.addresses';
import * as Types from '../types/orders.types';
import { encodeForMatchOrders } from './orders.helpers.encode-order';

@Injectable()
export class OrdersHelpers {
  constructor(private readonly rpcProvider: RpcProvider) {}

  chainId = this.rpcProvider.chainId;

  private EIP712_DOMAIN = (chainId: number) => ({
    name: 'Exchange',
    version: '2',
    chainId,
    verifyingContract: Addresses.Exchange[chainId],
  });

  toRawOrder = (order: Types.Order): any => {
    const encoded = encodeForMatchOrders(order);
    // console.log(encoded, 'encoded again logged out');
    return encoded;
  };

  /**
   * checkSignature
   * @param order
   * @returns true if signer is order maker
   */
  public checkSignature(order: Types.Order) {
    const message = this.toRawOrder(order);
    // TODO: Change hardcoded testnet chain id to original chainId while deploying
    const domain = this.EIP712_DOMAIN(5);
    const signer = utils.verifyTypedData(
      domain,
      Types.EIP712_TYPES,
      message,
      order.signature,
    );

    if (lowerCase(order.maker) !== lowerCase(signer)) {
      throw new Error('Invalid signature');
    }
  }
}
