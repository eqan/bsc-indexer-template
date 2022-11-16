import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';
import { getEventData } from '../data';

@Injectable()
export class SyncEventsService {
  constructor(
    private readonly fetchCollectionsService: FetchCollectionsService,
    private readonly rpcProvider: RpcProvider,
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
        ]);

        const eventData = availableEventData.find(
          ({ addresses, topic, numTopics }) =>
            log.topics[0] === topic &&
            log.topics.length === numTopics &&
            (addresses ? addresses[log.address.toLowerCase()] : true),
        );

        if (eventData) {
          switch (eventData?.kind) {
            // NFT Collections
            case 'erc721-transfer':
            case 'erc1155-transfer-single': {
              // const { args } = eventData.abi.parseLog(log);
              const { args } = eventData.abi.parseLog(log);
              const tokenId = args?.tokenId.toString() || '';
              const collectionId = log?.address || '';
              const kind = eventData.kind;
              const timestamp = (
                await this.rpcProvider.baseProvider.getBlock(log?.blockNumber)
              ).timestamp;

              await this.fetchCollectionsService.fetchCollection(
                collectionId,
                tokenId,
                timestamp,
                kind,
              );
              break;
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Event Sync Failed');
    }
  };
}
