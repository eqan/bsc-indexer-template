import { ActivityType } from 'src/activities/entities/enums/activity.type.enum';
import { AddressZero } from '@ethersproject/constants';
import { Injectable, Logger } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
@Injectable()
export class ExtractActivityService {
  constructor(private readonly tokensService: TokensService) {}
  private readonly logger = new Logger('ExtractActivityService');
  public async handleExtraction(
    tokenId: string,
    collectionId: string,
    logIndex: number,
    blockHash: string,
    blockNumber: number,
    txHash: string,
    value: string,
    reverted: boolean,
    to: string,
    from: string,
    owner: string,
    timestamp: number,
  ) {
    let activityType = ActivityType.TRANSFER;
    let mint = null;
    let burn = null;
    let transfer = null;
    const itemId = collectionId + ':' + tokenId;
    const bid = null;

    const token = await this.tokensService.tokenExistOrNot(itemId);

    if (from === AddressZero) {
      activityType = ActivityType.MINT;
      mint = {
        tokenId,
        transactionHash: txHash,
        contract: collectionId,
        owner,
        itemId,
        value,
      };
      if (token)
        await this.tokensService.update({
          id: itemId,
          mintedAt: new Date(timestamp * 1000),
        });
    } else if (to === AddressZero) {
      activityType = ActivityType.BURN;
      burn = {
        tokenId,
        transactionHash: txHash,
        contract: collectionId,
        value,
        owner,
      };
      if (token)
        await this.tokensService.update({
          id: itemId,
          deleted: true,
        });
    } else {
      activityType = ActivityType.TRANSFER;
      transfer = {
        tokenId,
        transactionHash: txHash,
        contract: collectionId,
        from,
        owner,
        itemId,
        value,
      };
    }
    const activityData = {
      id: txHash,
      collectionId: collectionId,
      userId: to,
      itemId: itemId,
      type: activityType,
      cursor: blockHash,
      reverted: reverted,
      date: new Date(timestamp * 1000),
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

    return activityData;
  }
}
