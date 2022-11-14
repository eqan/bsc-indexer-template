import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { getNetworkSettings } from 'src/config/network.config';
import { fetchCollectionQueue } from 'src/common/utils.common';
import { QueueType } from '../enums/jobs.enums';

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

  async fetchCollection(fromBlock: number, toBlock: number) {
    try {
      await this.fetchCollections.add(
        { data: { fromBlock, toBlock } },
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
