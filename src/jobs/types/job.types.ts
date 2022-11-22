import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { EventDataKind } from 'src/events/types/events.types';

export class RealTimeJobType {
  headBlock: number;
}

export class MidWayJobType {
  fromBlock: number;
  toBlock: number;
}

export class FetchCollectionTypeJob {
  collectionId: string;
  tokenId: string;
  timestamp: number;
  kind: EventDataKind;
  deleted: boolean;
}

export class RefreshMetadataJobType {
  collectionId: string;
  tokenId: string;
}

@InputType('RefreshMetadataInput')
export class RefreshMetadatInput {
  @IsNotEmpty()
  @IsEthereumAddress()
  @Field(() => String)
  collectionId: string;

  @IsNotEmpty()
  @Field(() => String)
  tokenId: string;
}
