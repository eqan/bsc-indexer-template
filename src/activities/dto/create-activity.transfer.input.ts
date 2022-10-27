import { Field, InputType } from '@nestjs/graphql';
import { CreateActivityInput } from './create-activity.input';

@InputType('CreateActivityTransferInput')
export class CreateActivityTransferInput {
  @Field()
  tokenId: string;

  @Field()
  value: string;

  @Field()
  from: string;

  @Field()
  owner: string;

  @Field()
  contract: string;

  @Field()
  itemId: string;

  @Field()
  purchase: boolean;

  @Field()
  transactionHash: string;
}
