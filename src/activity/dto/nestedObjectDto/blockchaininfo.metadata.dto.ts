import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ObjectType("BlockChainInfo")
@InputType("BlockChainInfoInput")
export class BlockChainInfo {
  @IsString()
  @IsNotEmpty()
  @Field()
  transactionHash: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  blockHash: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(()=> Int)
  blockNumber: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(()=> Int)
  logIndex: number;
}