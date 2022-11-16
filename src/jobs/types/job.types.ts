import { Log } from '@ethersproject/providers';
import { EventData, EventDataKind } from 'src/events/data';

export class RealTimeJobType {
  headBlock: number;
}

export class MidWayJobType {
  fromBlock: number;
  toBlock: number;
}

export class FetchCollectionTypeJob {
  collectionId: string;
  tokenId: string;
  timestamp: number;
  kind: EventDataKind;
}
