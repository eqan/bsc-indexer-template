import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  TableInheritance,
} from 'typeorm';
import { BlockChainInfoDto } from '../dto/nestedActivityObject/activity.blockchain.info.dto';
import { ActivityTransfer } from './activity.transfer.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType()
@Entity()
@TableInheritance({
  column: {
    type: 'varchar',
    name: 'type',
  },
})
export abstract class Activity extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  activityId: string;

  @Field(() => ActivityType)
  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'ActivityType',
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

  // @Column(()=>ActivityTransfer)
  // activityTransfer: ActivityTransfer
}
