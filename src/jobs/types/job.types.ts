import { EventDataKind } from 'src/events/types/events.types';

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
