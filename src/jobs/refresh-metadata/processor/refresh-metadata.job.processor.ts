import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CollectionsService } from 'src/collections/collections.service';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { RefreshMetadataJobType } from 'src/jobs/types/job.types';
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
      const collection = await this.collectionsService.collectionExistOrNot(
        collectionId,
      );

      const token = await this.tokensService.tokenExistOrNot(
        `${collectionId}:${tokenId}`,
      );

      if (collection && token) {
        const response = await this.metadataApi.getCollectionMetadata(
          collectionId,
          collection.type,
        );

        await this.collectionsService.createCollection(response);

        const token = await this.tokensService.getTokenById(
          `${collectionId}:${tokenId}`,
        );

        const tokenMeta = await this.metadataApi.getTokenMetadata({
          collectionId,
          tokenId,
          type: token.type,
          timestamp: token.mintedAt.getTime(),
          deleted: token.deleted,
        });

        await this.tokensService.createToken(tokenMeta);
        this.logger.log(`Refreshed Metadata ${collectionId}-${tokenId}`);
        // return { refreshedCollection, refreshedToken };
      } else throw new BadRequestException('Token or Collection Id not found');
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
