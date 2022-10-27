import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateActivityInput } from './create-activity.input';

@InputType('CreateActivityMintInput')
export class CreateActivityMintInput {
  @IsOptional()
  @Field({ nullable: true })
  tokenId?: string;

  @IsOptional()
  @Field({ nullable: true })
  value?: string;

  @IsOptional()
  @Field({ nullable: true })
  owner?: string;

  @IsOptional()
  @Field({ nullable: true })
  contract?: string;

  @IsOptional()
  @Field({ nullable: true })
  itemId?: string;

  @IsOptional()
  @Field({ nullable: true })
  transactionHash?: string;
}
