import { Interface } from '@ethersproject/abi';
import * as erc721 from './erc721';
import * as erc1155 from './erc1155';

// All events we're syncing should have an associated `EventData`
// entry which dictates the way the event will be parsed and then
// handled (eg. persisted to the database and relayed for further
// processing to any job queues).

export type EventDataKind =
  | 'erc721-transfer'
  | 'erc1155-transfer-single'
  | 'erc1155-transfer-batch'
  | 'erc721/1155-approval-for-all'
  | 'erc20-approval'
  | 'erc20-transfer';

export type EventData = {
  kind: EventDataKind;
  addresses?: { [address: string]: boolean };
  topic: string;
  numTopics: number;
  abi: Interface;
};

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
