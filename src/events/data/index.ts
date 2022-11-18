import { Interface } from '@ethersproject/abi';
import * as erc721 from './erc721';
import * as erc1155 from './erc1155';
import { Log } from '@ethersproject/providers';

// All events we're syncing should have an associated `EventData`
// entry which dictates the way the event will be parsed and then
// handled (eg. persisted to the database and relayed for further
// processing to any job queues).

export type EventDataKind =
  | 'erc721-transfer'
  | 'erc721-mint'
  | 'erc1155-transfer-single'
  | 'erc1155-transfer-batch'
  | 'erc721/1155-approval-for-all'
  | 'erc20-approval'
  | 'erc20-transfer';

//type defining the format for filtering event
export type EventData = {
  kind: EventDataKind;
  addresses?: { [address: string]: boolean };
  topic: string;
  numTopics: number;
  abi: Interface;
};

const internalGetEventData = (kind: EventDataKind): EventData | undefined => {
  switch (kind) {
    case 'erc721-transfer':
      return erc721.transfer;
    case 'erc721/1155-approval-for-all':
      return erc721.approvalForAll;
    case 'erc1155-transfer-batch':
      return erc1155.transferBatch;
    case 'erc1155-transfer-single':
      return erc1155.transferSingle;
  }
};

//checks if the event kind exists ; returns its related event data eg; abi,topic,kind for erc721 events
export const getEventData = (eventDataKinds?: EventDataKind[]) => {
  if (!eventDataKinds) {
    return [
      erc721.transfer,
      erc721.approvalForAll,
      erc1155.transferSingle,
      erc1155.transferBatch,
    ];
  } else {
    return (
      eventDataKinds
        .map(internalGetEventData)
        .filter(Boolean)
        // Force TS to remove `undefined`
        .map((x) => x!)
    );
  }
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

export const parseEvent = async (
  log: Log,
  timestamp: number,
  batchIndex = 1,
): Promise<BaseEventParams> => {
  const address = log.address.toLowerCase();
  const blockNumber = log.blockNumber;
  const blockHash = log.blockHash.toLowerCase();
  const txHash = log.transactionHash.toLowerCase();
  const txIndex = log.transactionIndex;
  const logIndex = log.logIndex;

  return {
    address,
    txHash,
    txIndex,
    blockNumber,
    blockHash,
    logIndex,
    timestamp,
    batchIndex,
  };
};

export type EnhancedEvent = {
  kind: EventDataKind;
  baseEventParams: BaseEventParams;
  log: Log;
};
