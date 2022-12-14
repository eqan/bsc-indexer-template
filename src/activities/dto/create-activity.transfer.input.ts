import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType('CreateActivityTransferInput')
export class CreateActivityTransferInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  tokenId: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  value: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  from: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  owner: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  contract: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  itemId: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  purchase: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  transactionHash: string;
}
