import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType('CreateActivityMintInput')
export class CreateActivityMintInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  tokenId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  value?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  owner?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  contract?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  itemId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  transactionHash?: string;
}
