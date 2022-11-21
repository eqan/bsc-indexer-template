import { ActivityType } from 'src/activities/entities/enums/activity.type.enum';
import { AddressZero } from '@ethersproject/constants';

export function extractActivityData(
  tokenId: string,
  logIndex: number,
  blockHash: string,
  blockNumber: number,
  txHash: string,
  value: string,
  reverted: boolean,
  to: string,
  from: string,
  owner: string,
) {
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
      value,
      owner,
    };
  } else if (to === AddressZero) {
    activityType = ActivityType.BURN;
    burn = {
      tokenId,
      txHash,
      value,
      owner,
    };
  } else {
    activityType = ActivityType.TRANSFER;
    transfer = {
      tokenId,
      txHash,
      from,
      value,
      owner,
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

  return activityData;
}
