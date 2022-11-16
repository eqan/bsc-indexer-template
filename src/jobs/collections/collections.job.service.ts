import { Log } from '@ethersproject/providers';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { getNetworkSettings } from 'src/config/network.config';
import { EventData, EventDataKind } from 'src/events/data';
import { QueueType } from '../enums/jobs.enums';
import { FetchCollectionTypeJob } from '../types/job.types';

/**
 * Fetch Collections
 * Job for fetching nft collections onchain and storing them offchain
 */

@Injectable()
export class FetchCollectionsService {
  constructor(
    @InjectQueue(QueueType.FETCH_COLLECTIONS_QUEUE)
    private fetchCollections: Queue,
  ) {}
  private readonly logger = new Logger(QueueType.FETCH_COLLECTIONS_QUEUE);
  networkSettings = getNetworkSettings();

  async fetchCollection(
    collectionId: string,
    tokenId: string,
    timestamp: number,
    kind: EventDataKind,
  ) {
    try {
      await this.fetchCollections.add(
        { collectionId, tokenId, timestamp, kind },
        {
          delay: 1000,
          removeOnComplete: true,
          removeOnFail: true,
          timeout: 60000,
        },
      );
    } catch (error) {
      this.logger.error(`Failed to activate collection fetch job: ${error}`);
    }
  }
}
