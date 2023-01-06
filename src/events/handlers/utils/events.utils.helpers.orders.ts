import { AddressZero } from '@ethersproject/constants';
import { Provider } from '@ethersproject/providers';
import {
  SafeTransferFromERC1155Iface,
  SafeTransferFromERC721Iface,
} from 'src/common/utils.common';
import { OrderSide } from 'src/events/enums/events.enums.order-side';
import * as constants from './events.utils.constants.order';
import { Routers } from './events.utils.constants.order';

export const extractAttributionData = async (
  txHash: string,
  baseProvider: Provider,
) => {
  let taker: string | undefined;
  // Properly set the taker when filling through router contracts
  const tx = await baseProvider.getTransaction(txHash);
  let router = Routers[1]?.[tx.to.toLowerCase()];
  console.log(router, 'router logged out');
  if (!router) {
    // Handle cases where we transfer directly to the router when filling bids
    if (tx.data.startsWith('0xb88d4fde')) {
      const result = SafeTransferFromERC721Iface.decodeFunctionData(
        'safeTransferFrom',
        tx.data,
      );
      router = Routers[1]?.[result.to.toLowerCase()];
    } else if (tx.data.startsWith('0xf242432a')) {
      const result = SafeTransferFromERC1155Iface.decodeFunctionData(
        'safeTransferFrom',
        tx.data,
      );
      router = Routers[1]?.[result.to.toLowerCase()];
    }
  }
  if (router) {
    taker = tx.from;
  }

  return {
    taker,
  };
};

export const getPaymentCurrency = (paymentCurrency: string) =>
  paymentCurrency === AddressZero ? constants.ETH : constants.ERC20;

export const getOrderSide = (assetClassHash: string) =>
  [constants.ERC721, constants.ERC1155].includes(assetClassHash)
    ? OrderSide.sell
    : OrderSide.buy;
