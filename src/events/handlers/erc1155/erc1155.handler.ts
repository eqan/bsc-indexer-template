import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { isDeleted } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { extractActivityData } from '../common/activity.handler.common';
import { FetchAndSaveMetadataService } from '../common/fetch-and-save-metadata.handler.common';

@Injectable()
export class ERC1155Handler {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly fetchAndSaveMetadataService: FetchAndSaveMetadataService,
  ) {}

  private readonly logger = new Logger('ERC1155Handler');

  handleTransferSingleEvent = async (event: EnhancedEvent) => {
    const {
      baseEventParams: { timestamp, logIndex, blockHash, blockNumber, txHash },
      log,
      kind,
    } = event;

    const eventData = getEventData([kind])[0];
    try {
      const parsedLog = eventData.abi.parseLog(log);
      const tokenId = parsedLog.args['tokenId'].toString();
      const collectionId = log?.address || '';
      const to = parsedLog.args['to'].toString();
      const from = parsedLog.args['from'].toString();
      const amount = parsedLog.args['amount'].toString();
      let owner = '';
      try {
        owner = parsedLog.args['owner'].toLowerCase();
      } catch (error) {
        owner = null;
      }
      //ACTIVITY FOR HANDLING ERC721 TRANSFER SINGLE EVENT
      await this.fetchAndSaveMetadataService.handleMetadata({
        collectionId,
        tokenId,
        event,
      });
      try {
        const activityData = extractActivityData(
          tokenId,
          collectionId,
          logIndex,
          blockHash,
          blockNumber,
          txHash,
          amount,
          false,
          to,
          from,
          owner,
          timestamp,
        );
        await this.activitiesService.create(activityData);
      } catch (error) {
        this.logger.error(`Failed creating activity : ${error}`);
        throw error;
      }
    } catch (error) {
      this.logger.error(`failed handling SingletransferEvent ${error}`);
    }
  };

  handleTransferBatchEvent = async (event: EnhancedEvent) => {
    const {
      baseEventParams: { timestamp, blockHash, logIndex, txHash, blockNumber },
      log,
      kind,
    } = event;

    const eventData = getEventData([kind])[0];
    try {
      const parsedLog = eventData.abi.parseLog(log);
      const tokenIds = parsedLog.args['tokenIds'].map(String);
      const amounts = parsedLog.args['amounts'].map(String);
      const count = Math.min(tokenIds.length, amounts.length);
      const collectionId = log?.address || '';
      const from = parsedLog.args['from'].toLowerCase();
      const to = parsedLog.args['to'].toLowerCase();
      let owner = '';
      try {
        owner = parsedLog.args['owner'].toLowerCase();
      } catch (error) {
        owner = null;
      }
      for (let i = 0; i < count; i++) {
        await this.fetchAndSaveMetadataService.handleMetadata({
          collectionId,
          tokenId: tokenIds[i],
          event,
        });
        //activity for ERC1155 TRANSFER BATCH EVENT
        try {
          const activityData = extractActivityData(
            tokenIds[i],
            collectionId,
            logIndex,
            blockHash,
            blockNumber,
            txHash,
            amounts[i],
            false,
            to,
            from,
            owner,
            timestamp,
          );
          await this.activitiesService.create(activityData);
        } catch (error) {
          this.logger.error(`Failed creating activity : ${error}`);
          throw error;
        }
      }
    } catch (error) {
      this.logger.error(`failed handling BatchtransferEvent ${error}`);
    }
  };
}
