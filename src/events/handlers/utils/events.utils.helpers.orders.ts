import { Interface } from '@ethersproject/abi';
import { Provider } from '@ethersproject/providers';
import { Routers } from './events.utils.constants.order';
import { AddressZero } from '@ethersproject/constants';
import * as constants from './events.utils.constants.order';
import { OrderTypeEnum } from 'src/graphqlFile';
import { AssetClassEnum } from 'src/orders/entities/enums/orders.asset-class.enum';

export const extractAttributionData = async (
  txHash: string,
  baseProvider: Provider,
  //   address?: string,
) => {
  let taker: string | undefined;

  // Properly set the taker when filling through router contracts
  const tx = await baseProvider.getTransaction(txHash);
  // console.log(tx.to, 'trans info to');
  // console.log(tx.from, 'trans info from');
  let router = Routers[1]?.[tx.to.toLowerCase()];
  console.log(router, 'router logged out');
  if (!router) {
    // Handle cases where we transfer directly to the router when filling bids
    if (tx.data.startsWith('0xb88d4fde')) {
      const iface = new Interface([
        'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
      ]);
      const result = iface.decodeFunctionData('safeTransferFrom', tx.data);
      router = Routers[1]?.[result.to.toLowerCase()];
    } else if (tx.data.startsWith('0xf242432a')) {
      const iface = new Interface([
        'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
      ]);
      const result = iface.decodeFunctionData('safeTransferFrom', tx.data);
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

export const getPaymentCurrencyAssetName = (paymentCurrency: string) =>
  paymentCurrency === AddressZero ? AssetClassEnum.ETH : AssetClassEnum.ERC20;
