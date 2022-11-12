import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity, PrimaryColumn
} from 'typeorm';
import { BlockChainInfoDto } from '../dto/nestedActivityObject/activity.blockchain.info.dto';
import { ActivityBurn } from './activity.burn.entity';
import { ActivityMint } from './activity.mint.entity';
import { ActivityTransfer } from './activity.transfer.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType()
@Entity()
// @TableInheritance({
//   column: {
//     type: 'varchar',
//     name: 'type'
//   },
// })
export abstract class Activity extends BaseEntity {
  @Field()
  @IsEthereumAddress()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field(() => ActivityType)
  @Column({
    enum: ActivityType,
    default: ActivityType.TRANSFER,
  })
  type: ActivityType;

  @Field()
  @Column({
    type: 'timestamptz',
  })
  date: Date;
  @Field()
  @Column({
    type: 'timestamptz',
  })
  lastUpdatedAt: Date;
  @Field()
  @Column({
    type: 'varchar',
  })
  cursor: string;
  @Field()
  @Column({
    type: 'boolean',
  })
  reverted: boolean;

  @Field(() => BlockChainInfoDto)
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
  // @IsEmpty()
  @Column(() => ActivityMint)
  MINT: ActivityMint;

  // @IsEmpty()
  @IsOptional()
  @Column(() => ActivityBurn)
  BURN: ActivityBurn;

  // @IsEmpty()
  @IsOptional()
  @Column(() => ActivityTransfer)
  TRANSFER: ActivityTransfer;
  // @Column(()=>ActivityTransfer)
  // activityTransfer: ActivityTransfer
}
