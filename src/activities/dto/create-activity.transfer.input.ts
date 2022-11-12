import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('CreateActivityTransferInput')
export class CreateActivityTransferInput {
  @IsOptional()
  @Field({ nullable: true })
  tokenId: string;

  @IsOptional()
  @Field({ nullable: true })
  value: string;

  @IsOptional()
  @Field({ nullable: true })
  from: string;

  @IsOptional()
  @Field({ nullable: true })
  owner: string;

  @IsOptional()
  @Field({ nullable: true })
  contract: string;

  @IsOptional()
  @Field({ nullable: true })
  itemId: string;

  @IsOptional()
  @Field({ nullable: true })
  purchase: boolean;

  @IsOptional()
  @Field({ nullable: true })
  transactionHash: string;
}
