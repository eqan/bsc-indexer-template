import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BlockChainInfoDto } from '../dto/nestedActivityObject/activity.blockchain.info.dto';
import { ActivityBid } from './activity.bid.entity';
import { ActivityBurn } from './activity.burn.entity';
import { ActivityMint } from './activity.mint.entity';
import { ActivityTransfer } from './activity.transfer.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType('Activity')
@Entity('ActivityInput')
export abstract class Activity extends Timestamps {
  @Field({ nullable: true })
  @IsEthereumAddress()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field({ nullable: true })
  @Column('text')
  userId: string;

  @Field({ nullable: true })
  @Column('text')
  itemId: string;

  @Field({ nullable: true })
  @Column('text')
  collectionId: string;

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

  // @Field({ nullable: true })
  // @Column({
  //   type: 'timestamptz',
  //   nullable: true,
  // })
  // @UpdateDateColumn()
  // lastUpdatedAt: Timestamps;

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
  @Field(() => ActivityBurn, { nullable: true })
  @OneToOne(() => ActivityBurn, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  BURN?: ActivityBurn;

  @IsOptional()
  @Field(() => ActivityTransfer, { nullable: true })
  @OneToOne(() => ActivityTransfer, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  TRANSFER?: ActivityTransfer;

  @IsOptional()
  @Field(() => ActivityBid, { nullable: true })
  @OneToOne(() => ActivityBid, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  BID?: ActivityBid;

  @IsOptional()
  @Field(() => ActivityMint, { nullable: true })
  @OneToOne(() => ActivityMint, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  MINT?: ActivityMint;
}
