import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { ActivityTypes } from '../enums/activity.types.enums';
import { BlockChainInfo } from './blockchaininfo.metadata.entity';

/*
    "@type": "MINT",
    "id": "ETHEREUM:624fd23963c052298d2e4407",
    "date": "2022-04-08T06:12:02Z",
    "reverted": false,
    "owner": "ETHEREUM:0x33b5606763150120076308076c91f01132a799da",
    "contract": "ETHEREUM:0x2703b3753930fe36b5af2b9b6cba1615fdf31310",
    "tokenId": "2",
    "itemId": "ETHEREUM:0x2703b3753930fe36b5af2b9b6cba1615fdf31310:2",
    "value": "1",
    "transactionHash": "0x74fd40687d29f2ac584c14b46ad871d82e0fbe3332a2679370b1117c4fac0e57",
    "blockchainInfo": {}
*/

@ObjectType()
@Entity('ActivityMetaData')
export class ActivityMetaData {
  @Field()
  @Column({type: 'text'})
  type: ActivityTypes;

  @Field()
  @Column({type: 'text'})
  activityId: string;

  @Type(() => Date)
  @Column('text')
  date: Date;
 
  @Field()
  @Column({type: 'bool'})
  reverted: boolean;

  @Field()
  @Column({type: 'string'})
  owner: string;

  @Field()
  @Column({type: 'string'})
  contract: string;

  @Field()
  @Column({type: 'int'})
  tokenId: number;

  @Field()
  @Column({type: 'string'})
  itemId: string;

  @Field()
  @Column({type: 'int'})
  value: number;

  @Field()
  @Column({type: 'string'})
  transactionHash: string;

  @Field()
  @Column({type: 'json', nullable: true})
  blockchaininfo: BlockChainInfo;
}