import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';
import { CollectionsService } from 'src/collections/collections.service';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { fetchCollectionQueue } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Processor(fetchCollectionQueue)
export class FetchCollectionsProcessor {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly collectionsService: CollectionsService,
    private readonly metadataApi: MetadataApi,
  ) {}
  private readonly logger = new Logger(fetchCollectionQueue);
  redis = new Redis();
  QUEUE_NAME = fetchCollectionQueue;

  @Process()
  async handleSync(job: Job) {
    try {
      console.log('hello from handle Sync Collections ');
      const filter: { fromBlock: number; toBlock: number } = {
        fromBlock: job.data.fromBlock,
        toBlock: job.data.toBlock,
      };
      const logs = await this.rpcProvider.baseProvider.getLogs(filter);
      for (const log of logs) {
        const availableEventData = getEventData(['erc721-transfer']);
        const eventData = availableEventData.find(
          ({ addresses, topic, numTopics }) =>
            log.topics[0] === topic &&
            log.topics.length === numTopics &&
            (addresses ? addresses[log.address.toLowerCase()] : true),
        );
        if (eventData) {
          // const { args } = eventData.abi.parseLog(log);
          const token = log?.address;
          const collection = await this.collectionsService.collectionExitOrNot(
            token,
          );
          console.log(collection, 'collection dgg');

          if (!collection) {
            const response = await this.metadataApi.getCollectionMetadata(
              token,
              CollectionType.BEP721,
            );
            const saved = await this.collectionsService.createCollection(
              response,
            );
            console.log(saved, 'saved metadata');
          }

          // const tokenId = args?.tokenId.toString();
          // const meta = await metadataApi.getTokenMetadata({ token, tokenId });
          // console.log(meta, 'metadata');
        }
      }
    } catch (error) {
      this.logger.error(`Failed fetching collections: ${error}`);
      throw error;
    }
  }

  @OnQueueError()
  onError(error: Error, job: Job) {
    this.logger.error(`Job ${job.id} failed fetching collections: ${error}`);
  }
}
