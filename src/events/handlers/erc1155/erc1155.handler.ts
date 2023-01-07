import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { isDeleted } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { FetchMetadataService } from 'src/jobs/metadata/metdata.job.service';
import { extractActivityData } from '../common/activity.handler.common';

@Injectable()
export class ERC1155Handler {
  constructor(
    private readonly fetchMetadataService: FetchMetadataService, // private readonly activitiesService: ActivitiesService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  private readonly logger = new Logger('ERC1155Handler');

  handleTransferSingleEvent = async (events: EnhancedEvent) => {
    const {
      baseEventParams: { timestamp },
      log,
      kind,
    } = events;

    const eventData = getEventData([kind])[0];
    try {
      const parsedLog = eventData.abi.parseLog(log);
      const tokenId = parsedLog.args['tokenId'].toString();
      const collectionId = log?.address || '';
      const kind = eventData.kind;
      const to = parsedLog.args['to'].toString();
      const deleted = isDeleted(to);
      //   const amount = parsedLog.args["amount"].toString();
      await this.fetchMetadataService.addFetchMetadataJob(
        collectionId,
        tokenId,
        timestamp,
        kind,
        deleted,
      );
    } catch (error) {
      this.logger.error(`failed handling SingletransferEvent ${error}`);
    }
  };

  handleTransferBatchEvent = async (events: EnhancedEvent) => {
    const {
      baseEventParams: { timestamp, blockHash, logIndex, txHash, blockNumber },
      log,
      kind,
    } = events;

    const eventData = getEventData([kind])[0];
    try {
      const parsedLog = eventData.abi.parseLog(log);
      const tokenIds = parsedLog.args['tokenIds'].map(String);
      const amounts = parsedLog.args['amounts'].map(String);
      const count = Math.min(tokenIds.length, amounts.length);
      const collectionId = log?.address || '';
      const from = parsedLog.args['from'].toLowerCase();
      const to = parsedLog.args['to'].toLowerCase();
      const kind = eventData.kind;
      const deleted = isDeleted(to);
      let owner = '';
      try {
        owner = parsedLog.args['owner'].toLowerCase();
      } catch (error) {
        owner = null;
      }
      for (let i = 0; i < count; i++) {
        await this.fetchMetadataService.addFetchMetadataJob(
          collectionId,
          tokenIds[i],
          timestamp,
          kind,
          deleted,
        );
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
