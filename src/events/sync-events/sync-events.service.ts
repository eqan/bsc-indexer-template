import { Injectable, Logger } from '@nestjs/common';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';

@Injectable()
export class SyncEventsService {
  constructor(
    private readonly fetchCollectionsService: FetchCollectionsService,
  ) {}
  private readonly logger = new Logger('Sync Events');

  syncEvents = async (
    fromBlock: number,
    toBlock: number,
    // options?: {
    //   // When backfilling, certain processes will be disabled
    //   backfill?: boolean;
    //   syncDetails:
    //     | {
    //         method: 'events';
    //         events: EventDataKind[];
    //       }
    //     | {
    //         method: 'address';
    //       };
    // },
  ) => {
    try {
      //activating fetch collection queue to filter nft collections
      this.fetchCollectionsService.fetchCollection(fromBlock, toBlock);
    } catch (error) {
      this.logger.error('Event Sync Failed');
    }
  };
}
