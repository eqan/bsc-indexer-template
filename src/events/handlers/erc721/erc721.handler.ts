import { Injectable, Logger } from '@nestjs/common';
import { ActivitiesService } from 'src/activities/activities.service';
import { EnhancedEvent, getEventData } from 'src/events/data';
import { ActivityType } from 'src/graphqlFile';
import { FetchCollectionsService } from 'src/jobs/collections/collections.job.service';
import { AddressZero } from '@ethersproject/constants';

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
      // const transactionHash = log?.transactionHash || '';

      let activityType = ActivityType.TRANSFER;
      let mint = null;
      let burn = null;
      let transfer = null;
      const bid = null;

      if (from === AddressZero) {
        activityType = ActivityType.MINT;
        mint = {
          tokenId,
          txHash,
        };
      } else if (to === AddressZero) {
        activityType = ActivityType.BURN;
        burn = {
          tokenId,
          txHash,
        };
      } else {
        activityType = ActivityType.TRANSFER;
        transfer = {
          tokenId,
          txHash,
          from,
        };
      }
      const activityData = {
        id: txHash,
        type: activityType,
        cursor: blockHash,
        reverted: reverted,
        date: new Date(),
        lastUpdatedAt: new Date(),
        blockchainInfo: {
          transactionHash: txHash,
          blockHash,
          blockNumber,
          logIndex,
        },
        MINT: mint,
        BURN: burn,
        TRANSFER: transfer,
        BID: bid,
      };

      await this.activitiesService.create(activityData);
      console.log(`Activity ${activityType} Saved!`);
    } catch (error) {
      this.logger.error(`Failed creating activity : ${error}`);
      throw error;
    }
  };
}
