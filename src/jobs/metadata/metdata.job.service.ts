import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { getNetworkSettings } from 'src/config/network.config';
import { QueueType } from '../enums/jobs.enums';
import { EventDataKind } from 'src/events/types/events.types';
import { randomUUID } from 'crypto';

/**
 * Fetch Collections
 * Job for fetching nft collections onchain and storing them offchain
 */

@Injectable()
export class FetchMetadataService {
  constructor(
    @InjectQueue(QueueType.FETCH_METADATA_QUEUE)
    private fetchMetadataQueue: Queue,
  ) {}
  private readonly logger = new Logger(QueueType.FETCH_METADATA_QUEUE);
  networkSettings = getNetworkSettings();

  async addFetchMetadataJob(
    collectionId: string,
    tokenId: string,
    timestamp: number,
    kind: EventDataKind,
    deleted: boolean,
  ) {
    try {
      await this.fetchMetadataQueue.add(
        { collectionId, tokenId, timestamp, kind, deleted },
        {
          jobId: randomUUID(),
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
