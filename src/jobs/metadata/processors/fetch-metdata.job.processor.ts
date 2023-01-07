import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import Redis from 'ioredis';
import { CollectionsService } from 'src/collections/collections.service';
import { getTypes } from 'src/common/utils.common';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { FetchMetadataJobType } from 'src/jobs/types/job.types';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Processor(QueueType.FETCH_METADATA_QUEUE)
export class FetchMetadataProcessor {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
    private readonly config: ConfigService,
  ) {}
  QUEUE_NAME = QueueType.FETCH_METADATA_QUEUE;
  private readonly logger = new Logger(this.QUEUE_NAME);
  redis = new Redis(this.config.get('REDIS_URL'));

  @Process()
  async FetchMetadata({
    data: { collectionId, tokenId, timestamp, kind, deleted },
  }: Job<FetchMetadataJobType>) {
    try {
      const { collectionType, type } = getTypes(kind);

      if (collectionId && tokenId) {
        const collection = await this.collectionsService.collectionExistOrNot(
          collectionId,
        );
        const token = await this.tokensService.tokenExistOrNot(tokenId);
        // console.log(token, 'created Token');
        if (!collection) {
          const response = await this.metadataApi.getCollectionMetadata(
            collectionId,
            collectionType,
          );
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
            // console.log(result);
          } catch (err) {
            console.log(err, collectionId);
            throw err;
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed Fetching Metadata: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(
      `Job ${job.data.jobId} failed fetching Metadata: ${error}`,
    );
  }
}
