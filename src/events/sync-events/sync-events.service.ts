import { Injectable, Logger } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { EnhancedEvent, getEventData, parseEvent } from '../data';
import { ERC1155Handler } from '../handlers/erc721/erc1155/erc1155.handler';
import { ERC721Handler } from '../handlers/erc721/erc721.handler';
@Injectable()
export class SyncEventsService {
  constructor(
    private readonly rpcProvider: RpcProvider,
    private readonly erc721Handler: ERC721Handler,
    private readonly erc1155Handler: ERC1155Handler,
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
          const baseEventParams = await parseEvent(log, timestamp);
          const enhancedEvents: EnhancedEvent = {
            kind: eventData?.kind,
            baseEventParams,
            log,
          };
          switch (eventData?.kind) {
            // NFT Collections
            case 'erc721-transfer': {
              await this.erc721Handler.handleTransferEvent(enhancedEvents);
              await this.erc721Handler.handleActivity(enhancedEvents);
              break;
            }
            case 'erc1155-transfer-single': {
              await this.erc1155Handler.handleTransferSingleEvent(
                enhancedEvents,
              );
              break;
            }
            case 'erc1155-transfer-batch': {
              await this.erc1155Handler.handleTransferBatchEvent(
                enhancedEvents,
              );
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
