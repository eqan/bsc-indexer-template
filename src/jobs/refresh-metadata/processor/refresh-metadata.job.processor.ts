import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { SyncEventsService } from 'src/events/sync-events/sync-events.service';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { RefreshMetadataJobType } from 'src/jobs/types/job.types';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
@Processor(QueueType.REFRESH_METADATA_QUEUE)
@Injectable()
export class RefreshMetadataProcessor {
  constructor(
    private readonly tokensService: TokensService,
    private readonly collectionsService: CollectionsService,
    private readonly metadataApi: MetadataApi,
  ) {}

  private readonly logger = new Logger(QueueType.REFRESH_METADATA_QUEUE);
  QUEUE_NAME = QueueType.REFRESH_METADATA_QUEUE;

  @Process()
  async handleSync({
    data: { collectionId, tokenId },
  }: Job<RefreshMetadataJobType>) {
    try {
      console.log('called');
      const collection = await this.collectionsService.collectionExistOrNot(
        collectionId,
      );
      const token = await this.tokensService.tokenExistOrNot(
        `${collectionId}:${tokenId}`,
      );
      console.log(collection, token);
      if (collection && token) {
        const response = await this.metadataApi.getCollectionMetadata(
          collectionId,
          CollectionType.BEP721,
        );
        console.log(response, 'response');
        const updatedCollection =
          await this.collectionsService.createCollection(response);

        // try {
        const token = await this.tokensService.getTokenById(
          `${collectionId}:${tokenId}`,
        );

        const tokenMeta = await this.metadataApi.getTokenMetadata({
          collectionId,
          tokenId,
          type: TokenType.BEP721,
          timestamp: Number(token.mintedAt),
        });

        console.log(tokenMeta, 'TOKENmETa');

        const updatedToken = await this.tokensService.createToken(tokenMeta);
        // } catch (err) {
        //   console.log(err, collectionId);
        //   throw err;
        // }

        console.log(updatedCollection, updatedToken, 'updatedMeta Logged');
        this.logger.log(`Event Sync BlockRange ${collectionId}-${tokenId}`);
      }
    } catch (error) {
      this.logger.error(`Refresh Metadata failed: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(`Queue ${job.id} refresh metadata failed : ${error}`);
  }
}
