// All events we're syncing should have an associated `EventData`
// entry which dictates the way the event will be parsed and then
// handled (eg. persisted to the database and relayed for further
// processing to any job queues).

import { Interface } from '@ethersproject/abi';
import { Log } from '@ethersproject/providers';

export type EventDataKind =
  | 'erc721-transfer'
  | 'erc721-mint'
  | 'erc1155-transfer-single'
  | 'erc1155-transfer-batch'
  | 'erc721/1155-approval-for-all'
  | 'erc20-approval'
  | 'erc20-transfer'
  | 'order-match'
  | 'order-cancel';

//type defining the format for filtering event
export type EventData = {
  kind: EventDataKind;
  addresses?: { [address: string]: boolean };
  topic: string;
  numTopics: number;
  abi: Interface;
};

export type Block = {
  hash: string;
  number: number;
  timestamp: number;
};

export type BaseEventParams = {
  address: string;
  blockNumber: number;
  blockHash: string;
  txHash: string;
  txIndex: number;
  logIndex: number;
  timestamp: number;
  batchIndex: number;
};

export type EnhancedEvent = {
  kind: EventDataKind;
  baseEventParams: BaseEventParams;
  log: Log;
};

export type fillMatchFunctionType =
  | 'directPurchase'
  | 'directAcceptBid'
  | 'match';

// export type OrderMatchEventInput = {
//   orderId: string;
//   orderSide: OrderSide;
//   maker: string;
//   taker: string;
//   price: string;
//   contract: string;
//   tokenId: string;
//   amount: string;
//   currency: string;
//   currencyPrice?: string;
//   usdPrice?: string;
//   baseEventParams: BaseEventParams;
// };
