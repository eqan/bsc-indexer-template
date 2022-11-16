import { Log } from '@ethersproject/providers';
import { EventData } from 'src/events/data';

export class RealTimeJobType {
  headBlock: number;
}

export class MidWayJobType {
  fromBlock: number;
  toBlock: number;
}

export class FetchCollectionTypeJob {
  eventData: EventData;
  log: Log;
}
