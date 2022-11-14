import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { CollectionsService } from 'src/collections/collections.service';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { getTypes } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { QueueType } from 'src/jobs/enums/jobs.enums';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Processor(QueueType.FETCH_COLLECTIONS_QUEUE)
export class FetchCollectionsProcessor {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly collectionsService: CollectionsService,
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
  ) {}
  QUEUE_NAME = QueueType.FETCH_COLLECTIONS_QUEUE;
  private readonly logger = new Logger(this.QUEUE_NAME);
  redis = new Redis();

  @Process()
  async FetchCollection(job: Job) {
    try {
      const filter: { fromBlock: number; toBlock: number } = {
        fromBlock: job.data.fromBlock,
        toBlock: job.data.toBlock,
      };

      const logs = await this.rpcProvider.baseProvider.getLogs(filter);
      for (const log of logs) {
        const availableEventData = getEventData([
          'erc721-transfer',
          'erc1155-transfer-single',
        ]);

        const eventData = availableEventData.find(
          ({ addresses, topic, numTopics }) =>
            log.topics[0] === topic &&
            log.topics.length === numTopics &&
            (addresses ? addresses[log.address.toLowerCase()] : true),
        );

        if (eventData) {
          const { collectionType, type } = getTypes(eventData.kind);
          const { args } = eventData.abi.parseLog(log);
          const tokenId = args?.tokenId.toString() || '';
          const collectionId = log?.address || '';

          if (collectionId && tokenId) {
            const collection =
              await this.collectionsService.collectionExistOrNot(collectionId);
            const token = await this.tokensService.tokenExistOrNot(tokenId);

            if (!collection) {
              const response = await this.metadataApi.getCollectionMetadata(
                collectionId,
                collectionType,
              );
              const saved = await this.collectionsService.createCollection(
                response,
              );
              console.log(saved, 'saved metadata');
            }

            if (!token) {
              const timestamp = (
                await this.rpcProvider.baseProvider.getBlock(log?.blockNumber)
              ).timestamp;

              const tokenMeta = await this.metadataApi.getTokenMetadata({
                collectionId,
                tokenId,
                type,
                timestamp,
              });
              const savedToken = await this.tokensService.createToken(
                tokenMeta,
              );
              console.log(savedToken, 'token saved in db');
            }
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
    this.logger.error(`Job ${job.id} failed fetching collections: ${error}`);
  }
}
