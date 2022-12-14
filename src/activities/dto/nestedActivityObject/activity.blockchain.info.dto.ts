import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType('BlockchainInfo')
@InputType('BlockchainInfoInput')
export class BlockChainInfoDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  transactionHash?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  blockHash?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  blockNumber?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  logIndex?: number;
}
