import { registerEnumType } from '@nestjs/graphql';

export enum AuctionStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  PENDING = 'PENDING',
}

export enum AuctionType {
  BEP20 = 'BEP20',
  BEP721 = 'BEP721',
  BEP1155 = 'BEP1155',
}

export enum AuctionDataType {
  RARIBLE_AUCTION_V1_DATA_V1 = 'RARIBLE_AUCTION_V1_DATA_V1',
}

registerEnumType(AuctionStatus, {
  name: 'AuctionStatus',
  description: 'Status of Auctions i.e. Active,InActive,Pending',
});

registerEnumType(AuctionType, {
  name: 'AuctionType',
  description: 'Type of the auction i.e. BEP20,BEP721,BEP1155',
});

registerEnumType(AuctionDataType, {
  name: 'AuctionDataType',
  description: 'Data type of Auction i.e. RARIBLE_AUCTION_V1_DATA_V1',
});
