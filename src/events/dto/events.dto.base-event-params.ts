import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseEventParamsInput {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  blockNumber: number;

  @IsString()
  @IsNotEmpty()
  blockHash: string;

  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsNumber()
  @IsNotEmpty()
  txIndex: number;

  @IsNumber()
  @IsNotEmpty()
  logIndex: number;

  @IsNumber()
  @IsNotEmpty()
  timestamp: number;

  @IsNumber()
  @IsNotEmpty()
  batchIndex: number;
}
