import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { EnhancedEvent, getEventData } from 'src/events/data';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';
import { extractActivityData } from '../common/activity.handler.common';

@Injectable()
export class ERC721Handler {
  constructor(
    private readonly fetchCollectionsService: FetchCollectionsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  private readonly logger = new Logger('ERC721Handler');

  handleTransferEvent = async (events: EnhancedEvent) => {
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
      await this.fetchCollectionsService.fetchCollection(
        collectionId,
        tokenId,
        timestamp,
        kind,
      );
    } catch (error) {
      this.logger.error(`failed handling trnasferEvent ${error}`);
    }
  };

  handleApprovalForAll = async (events: EnhancedEvent) => {
    const {
      baseEventParams: { timestamp },
      log,
      kind,
    } = events;

    try {
      const eventData = getEventData([kind])[0];
      const parsedLog = eventData.abi.parseLog(log);
      const owner = parsedLog.args['owner'].toLowerCase();
      const operator = parsedLog.args['operator'].toLowerCase();
      const approved = parsedLog.args['approved'];
    } catch (error) {
      this.logger.error(`failed handling ApprovalForAll ${error}`);
    }
  };

  handleActivity = async (events: EnhancedEvent) => {
    const {
      baseEventParams: { blockHash, logIndex, txHash, blockNumber },
      log,
      kind,
    } = events;
    const eventData = getEventData([kind])[0];
    try {
      // Activity Data
      const parsedLog = eventData.abi.parseLog(log);
      const from = parsedLog.args['from'].toLowerCase();
      const to = parsedLog.args['to'].toLowerCase();
      const reverted = log?.removed || false;
      const tokenId = parsedLog.args['tokenId'].toString();
      // const owner = parsedLog.args['owner'].toLowerCase();
      const activityData = extractActivityData(
        tokenId,
        logIndex,
        blockHash,
        blockNumber,
        txHash,
        '',
        reverted,
        to,
        from,
        null,
      );
      await this.activitiesService.create(activityData);
    } catch (error) {
      this.logger.error(`Failed creating activity : ${error}`);
      throw error;
    }
  };
}
