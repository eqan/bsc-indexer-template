import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { isDeleted, lowerCase } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { FetchMetadataService } from 'src/jobs/metadata/metdata.job.service';
import { extractActivityData } from '../common/activity.handler.common';

@Injectable()
export class ERC721Handler {
  constructor(
    private readonly fetchMetadataService: FetchMetadataService,
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
      const to = parsedLog.args['to'].toString();
      const deleted = isDeleted(to);
      await this.fetchMetadataService.addFetchMetadataJob(
        collectionId,
        tokenId,
        timestamp,
        kind,
        deleted,
      );
    } catch (error) {
      this.logger.error(`failed handling trnasferEvent ${error}`);
    }
  };

  //TODO:approval for all event storage in db
  handleApprovalForAll = async (events: EnhancedEvent) => {
    const { log, kind } = events;

    try {
      const eventData = getEventData([kind])[0];
      const parsedLog = eventData.abi.parseLog(log);
      const owner = lowerCase(parsedLog.args['owner']);
      const operator = lowerCase(parsedLog.args['operator']);
      const approved = parsedLog.args['approved'];
    } catch (error) {
      this.logger.error(`failed handling ApprovalForAll ${error}`);
    }
  };

  handleActivity = async (events: EnhancedEvent) => {
    const {
      baseEventParams: { blockHash, logIndex, txHash, blockNumber, timestamp },
      log,
      kind,
    } = events;
    const eventData = getEventData([kind])[0];
    try {
      // Activity Data
      const parsedLog = eventData.abi.parseLog(log);
      const from = lowerCase(parsedLog.args['from']);
      const to = lowerCase(parsedLog.args['to']);
      const reverted = log?.removed || false;
      const tokenId = parsedLog.args['tokenId'].toString();
      const collectionId = log?.address;
      let owner = null;
      try {
        owner = parsedLog.args['owner'].toLowerCase();
      } catch (error) {
        owner = null;
      }
      const activityData = extractActivityData(
        tokenId,
        collectionId,
        logIndex,
        blockHash,
        blockNumber,
        txHash,
        '',
        reverted,
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
  };
}
