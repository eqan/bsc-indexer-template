import { ConfigService } from '@nestjs/config';
import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { CollectionsService } from 'src/collections/collections.service';
import { getTypes } from 'src/common/utils.common';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { FetchCollectionTypeJob } from 'src/jobs/types/job.types';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Processor(QueueType.FETCH_COLLECTIONS_QUEUE)
export class FetchCollectionsProcessor {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
    private readonly config: ConfigService,
  ) {}
  QUEUE_NAME = QueueType.FETCH_COLLECTIONS_QUEUE;
  private readonly logger = new Logger(this.QUEUE_NAME);
  redis = new Redis(this.config.get('REDIS_URL'));

  @Process()
  async FetchCollection({
    data: { collectionId, tokenId, timestamp, kind, deleted },
  }: Job<FetchCollectionTypeJob>) {
    try {
      const { collectionType, type } = getTypes(kind);

      if (collectionId && tokenId) {
        const collection = await this.collectionsService.collectionExistOrNot(
          collectionId,
        );
        const token = await this.tokensService.tokenExistOrNot(tokenId);

        if (!collection) {
          const response = await this.metadataApi.getCollectionMetadata(
            collectionId,
            collectionType,
          );
          // console.log(response);
          await this.collectionsService.create(response);
        }

        if (!token) {
          try {
            const tokenMeta = await this.metadataApi.getTokenMetadata({
              collectionId,
              tokenId,
              type,
              timestamp,
              deleted,
            });

            // console.log(tokenMeta.Meta);
            if (!tokenMeta.Meta || !tokenMeta.Meta.name) {
              tokenMeta.Meta = null;
            }

            const result = await this.tokensService.create(tokenMeta);
            console.log(result.Meta);
          } catch (err) {
            console.log(err, collectionId);
            throw err;
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed fetching collection: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(
      // `Job ${job.data.jobId} failed fetching collections: ${error}`,
      `Job failed fetching collections: ${error}`,
    );
  }
}
