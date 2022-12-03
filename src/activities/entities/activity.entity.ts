import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { BlockChainInfoDto } from '../dto/nestedActivityObject/activity.blockchain.info.dto';
import { ActivityBid } from './activity.bid.entity';
import { ActivityBurn } from './activity.burn.entity';
import { ActivityMint } from './activity.mint.entity';
import { ActivityTransfer } from './activity.transfer.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType('Activity')
@Entity('ActivityInput')
export abstract class Activity extends BaseEntity {
  @Field({ nullable: true })
  @IsEthereumAddress()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field(() => ActivityType, { nullable: true })
  @Column({
    enum: ActivityType,
    default: ActivityType.TRANSFER,
    nullable: true,
  })
  type?: ActivityType;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'NOW()',
  })
  date: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  cursor: string;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
  })
  reverted: boolean;

  @Field(() => BlockChainInfoDto, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  blockchainInfo?: {
    transactionHash?: string;
    blockHash?: string;
    blockNumber?: number;
    logIndex?: number;
  };

  @IsOptional()
  @Field(() => ActivityMint, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  MINT?: ActivityMint;

  @IsOptional()
  @Field(() => ActivityBurn, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  BURN: ActivityBurn;

  @IsOptional()
  @Field(() => ActivityTransfer, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  TRANSFER: ActivityTransfer;

  @IsOptional()
  @Field(() => ActivityBid, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  BID: ActivityBid;
}
