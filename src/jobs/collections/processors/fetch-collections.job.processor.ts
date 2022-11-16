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
import { ActivitiesService } from 'src/activities/activities.service';
import { ActivityType } from 'src/graphqlFile';

@Processor(QueueType.FETCH_COLLECTIONS_QUEUE)
export class FetchCollectionsProcessor {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly collectionsService: CollectionsService,
    private readonly activitiesService: ActivitiesService,
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

      const genesisBlock = '0x0000000000000000000000000000000000000000';
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
          const fromBlock = args?.from || '';
          const toBlock = args?.to || '';

          // Activity Data
          const blockNumber = log?.blockNumber || null;
          const blockHash = log?.blockHash || '';
          const reverted = log?.removed || false;
          const logIndex = log?.logIndex || null;
          const transactionHash = log?.transactionHash || '';
          let activityType = ActivityType.TRANSFER;
          let mint = null;
          let burn = null;
          let transfer = null;
          const bid = null;

          // console.log('Args Data: ', args, '\n');
          // console.log('Logs Data: ', log, '\n');

          if (fromBlock === genesisBlock) {
            activityType = ActivityType.MINT;
            mint = {
              tokenId: tokenId,
              transactionHash: transactionHash,
            };
          } else if (toBlock === genesisBlock) {
            activityType = ActivityType.BURN;
            burn = {
              tokenId: tokenId,
              transactionHash: transactionHash,
            };
          } else {
            activityType = ActivityType.TRANSFER;
            transfer = {
              tokenId: tokenId,
              transactionHash: transactionHash,
              from: fromBlock,
            };
          }
          const activityData = {
            id: transactionHash,
            type: activityType,
            cursor: blockHash,
            reverted: reverted,
            date: new Date(),
            lastUpdatedAt: new Date(),
            blockchainInfo: {
              transactionHash: transactionHash,
              blockHash: blockHash,
              blockNumber: blockNumber,
              logIndex: logIndex,
            },
            MINT: mint,
            BURN: burn,
            TRANSFER: transfer,
            BID: bid,
          };

          try {
            this.activitiesService.create(activityData);
            console.log(`Activity ${activityType} Saved!`);
          } catch (error) {
            this.logger.error(`Failed creating activity : ${error}`);
            throw error;
          }

          if (collectionId && tokenId) {
            const collection =
              await this.collectionsService.collectionExistOrNot(collectionId);
            const token = await this.tokensService.tokenExistOrNot(tokenId);

            if (!collection) {
              const response = await this.metadataApi.getCollectionMetadata(
                collectionId,
                collectionType,
              );
              await this.collectionsService.createCollection(response);
            }

            if (!token) {
              const timestamp = (
                await this.rpcProvider.baseProvider.getBlock(log?.blockNumber)
              ).timestamp;

              try {
                const tokenMeta = await this.metadataApi.getTokenMetadata({
                  collectionId,
                  tokenId,
                  type,
                  timestamp,
                });

                await this.tokensService.createToken(tokenMeta);
              } catch (err) {
                console.log(err, collectionId);
                throw err;
              }
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
