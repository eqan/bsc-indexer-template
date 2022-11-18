import { Log } from '@ethersproject/providers';
import {
  BaseEventParams,
  EventData,
  EventDataKind,
} from '../types/events.types';
import * as erc1155 from './erc1155';
import * as erc721 from './erc721';

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
