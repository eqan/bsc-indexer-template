import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('CreateActivityBurnInput')
export class CreateActivityBurnInput {
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
  transactionHash?: string;
}
