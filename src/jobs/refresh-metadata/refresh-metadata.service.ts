import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { getNetworkSettings } from 'src/config/network.config';
import { QueueType } from '../enums/jobs.enums';
import { RpcProvider } from '../../common/rpc-provider/rpc-provider.common';

/**
 * RefreshMetadata Cron
 * Cron Job that will execute once or twice a week to update the metadata of nft offchain
 */
@Injectable()
export class RefreshMetadataService {
  constructor(
    @InjectQueue(QueueType.REFRESH_METADATA_QUEUE)
    private refreshMetadata: Queue,
    private readonly rpcProvider: RpcProvider,
  ) {}
  private readonly logger = new Logger(QueueType.REFRESH_METADATA_QUEUE);
  networkSettings = getNetworkSettings();

  async addRefrsehMetadataJob(collectionId: string, tokenId: string) {
    await this.refreshMetadata.add(
      {
        collectionId,
        tokenId,
      },
      {
        jobId: randomUUID(),
        removeOnComplete: true,
        attempts: 5,
        removeOnFail: true,
        timeout: 60000,
      },
    );
  }
}
