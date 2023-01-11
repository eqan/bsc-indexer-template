import { EnhancedEvent } from 'src/events/types/events.types';

export class RealTimeJobType {
  headBlock: number;
}

export class MidWayJobType {
  fromBlock: number;
  toBlock: number;
}

export class FetchMetadataJobType {
  collectionId: string;
  tokenId: string;
}
