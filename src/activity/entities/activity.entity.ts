import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BlockChainInfo } from '../dto/metadatadto/blockchaininfo.metadata.dto';
import { ActivityTypes } from '../enums/activity.types.enums';

@ObjectType()
@Entity('Activity')
export class Activity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column({
    type: 'enum',
    enumName: 'ActivityTypes',
    enum: ActivityTypes,
    default: ActivityTypes.MINT
  })
  type: ActivityTypes;

  @Field()
  @IsEthereumAddress({ message: 'Owner address should be an ethereum address' })
  @Column({type: 'text'})
  owner: string;

  @Field()
  @CreateDateColumn({name: 'created_at'})
  date: Date;
 
  @Field()
  @CreateDateColumn({name: 'updated_at'})
  lastUpdatedAt?: Date;

  @Field()
  @Column({type: 'text', nullable: true})
  cursor?: string;
 
  @Field()
  @Column({type: 'boolean', nullable: true})
  reverted?: boolean;

  @Field()
  @Column({type: 'text'})
  contract: string;

  @Field()
  @Column({type: 'int', nullable: true})
  tokenId?: number;

  @Field()
  @Column({type: 'text', nullable: true})
  itemId?: string;

  @Field()
  @Column({type: 'int'})
  value: number;

  @Field()
  @Column({type: 'text'})
  transactionHash: string;

  @Field(() => BlockChainInfo)
  @Column({type: 'json'})
  blockChainInfo: {
    transactionHash: string,
    blockHash: string,
    blockNumber: number,
    logIndex: number
  };
}