import { Injectable, Logger } from '@nestjs/common';
import { isDeleted } from 'src/common/utils.common';
import { getEventData } from 'src/events/data';
import { EnhancedEvent } from 'src/events/types/events.types';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';

@Injectable()
export class ERC1155Handler {
  constructor(
    private readonly fetchCollectionsService: FetchCollectionsService, // private readonly activitiesService: ActivitiesService,
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
      await this.fetchCollectionsService.fetchCollection(
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
      baseEventParams: { timestamp },
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
      const kind = eventData.kind;
      const to = parsedLog.args['to'].toString();
      const deleted = isDeleted(to);
      for (let i = 0; i < count; i++) {
        await this.fetchCollectionsService.fetchCollection(
          collectionId,
          tokenIds[i],
          timestamp,
          kind,
          deleted,
        );
      }
    } catch (error) {
      this.logger.error(`failed handling BatchtransferEvent ${error}`);
    }
  };
}
