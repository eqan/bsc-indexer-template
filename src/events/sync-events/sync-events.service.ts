import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { ActivityType } from 'src/graphqlFile';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';
import { getEventData } from '../data';

@Injectable()
export class SyncEventsService {
  constructor(
    private readonly fetchCollectionsService: FetchCollectionsService,
    private readonly rpcProvider: RpcProvider,
    private readonly activitiesService: ActivitiesService,
  ) {}
  private readonly logger = new Logger('Sync Events');

  syncEvents = async (
    fromBlock: number,
    toBlock: number,
    // options?: {
    //   // When backfilling, certain processes will be disabled
    //   backfill?: boolean;
    //   syncDetails:
    //     | {
    //         method: 'events';
    //         events: EventDataKind[];
    //       }
    //     | {
    //         method: 'address';
    //       };
    // },
  ) => {
    try {
      const filter: { fromBlock: number; toBlock: number } = {
        fromBlock,
        toBlock,
      };

      const logs = await this.rpcProvider.baseProvider.getLogs(filter);
      for (const log of logs) {
        const availableEventData = getEventData([
          'erc721-transfer',
          'erc1155-transfer-single',
          // 'erc721/1155-approval-for-all',
          'erc1155-transfer-batch',
        ]);

        const eventData = availableEventData.find(
          ({ addresses, topic, numTopics }) =>
            log.topics[0] === topic &&
            log.topics.length === numTopics &&
            (addresses ? addresses[log.address.toLowerCase()] : true),
        );

        if (eventData) {
          const timestamp = (
            await this.rpcProvider.baseProvider.getBlock(log?.blockNumber)
          ).timestamp;

          switch (eventData?.kind) {
            // NFT Collections
            case 'erc721-transfer':
            case 'erc1155-transfer-single': {
              const genesisBlock = '0x0000000000000000000000000000000000000000';
              const parsedLog = eventData.abi.parseLog(log);
              const tokenId = parsedLog.args['tokenId'].toString();
              const collectionId = log?.address || '';
              const kind = eventData.kind;
              const fromBlock = parsedLog.args['from'].toLowerCase();
              const toBlock = parsedLog.args['to'].toLowerCase();

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

              await this.fetchCollectionsService.fetchCollection(
                collectionId,
                tokenId,
                timestamp,
                kind,
              );

              try {
                await this.activitiesService.create(activityData);
                console.log(`Activity ${activityType} Saved!`);
              } catch (error) {
                this.logger.error(`Failed creating activity : ${error}`);
                throw error;
              }

              break;
            }
            case 'erc1155-transfer-batch': {
              const parsedLog = eventData.abi.parseLog(log);
              const tokenIds = parsedLog.args['tokenIds'].map(String);
              const amounts = parsedLog.args['amounts'].map(String);
              const count = Math.min(tokenIds.length, amounts.length);
              const collectionId = log?.address || '';
              const kind = eventData.kind;
              for (let i = 0; i < count; i++) {
                await this.fetchCollectionsService.fetchCollection(
                  collectionId,
                  tokenIds[i],
                  timestamp,
                  kind,
                );
              }
              break;
            }
            case 'erc721/1155-approval-for-all': {
              // const parsedLog = eventData.abi.parseLog(log);
              // const owner = parsedLog.args['owner'].toLowerCase();
              // const operator = parsedLog.args['operator'].toLowerCase();
              // const approved = parsedLog.args['approved'];
              break;
            }
            default:
              break;
          }
        }
      }
    } catch (error) {
      this.logger.error('Event Sync Failed', error);
    }
  };
}
