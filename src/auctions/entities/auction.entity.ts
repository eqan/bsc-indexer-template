import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DataInput } from '../dto/nestedObjects/data.json.dto';
import { LsatBid } from '../dto/nestedObjects/lastBid.json.dto';
import { Sell } from '../dto/nestedObjects/sell.json.dto';
import { SellTypeDto } from '../dto/nestedObjects/sell.type.json.dto';
import { AuctionDataType, AuctionStatus, AuctionType } from './enums';

@ObjectType()
@Entity('Auction')
export class Auction {
  @Field()
  @PrimaryColumn({
    type: 'decimal',
    unique: true
  })
  auctionId: number;

  @Field()
  @Column({
    type: 'varchar'
  })
  contract: string;

  @Field()
  @Column({
    type: 'varchar'
  })
  seller: string;

  @Field(() => AuctionType)
  @Column({
    type: 'enum',
    enum: AuctionType,
    enumName: 'AuctionType',
    default: AuctionType.BEP721
  })
  type: AuctionType;

  @Field(() => Sell)
  @Column({
    type: 'jsonb'
  })
  sell: {
    type: {
      type: string;
      contract: string;
      tokenId: string;
    };
    value: number;
  };

  @Field(() => SellTypeDto)
  @Column({
    type: 'jsonb'
  })
  buy: {
    type: string;
    contract: string;
    tokenId: string;
  };

  @Field()
  @Column({
    type: 'timestamptz'
  })
  endTime: Date;

  @Field()
  @Column({
    type: 'decimal'
  })
  minimalStep: number;

  @Field()
  @Column({
    type: 'decimal'
  })
  minimalPrice: number;

  @Field()
  @Column({
    type: 'timestamptz'
  })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamptz'
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'decimal'
  })
  buyPrice: number;

  @Field()
  @Column({
    type: 'decimal'
  })
  buyPriceUsd: number;

  // @Field()
  // @Column()
  // pending:{}

  @Field(() => AuctionStatus)
  @Column({
    type: 'enum',
    enum: AuctionStatus,
    enumName: 'AuctionStatus',
    default: AuctionStatus.ACTIVE
  })
  status: AuctionStatus;

  @Field()
  @Column({
    type: 'boolean'
  })
  ongoing: boolean;

  @Field()
  @Column({
    type: 'varchar'
  })
  hash: string;

  @Field(() => LsatBid)
  @Column({
    type: 'jsonb'
  })
  lastBid: {
    buyer: string;
    amount: number;
    date: Date;
    status: string;
    type: string;
    data: {
      dataType: AuctionDataType;
      originFees: {
        account: string;
        value: number;
      };
      pauouts: {
        account: string;
        valueL: number;
      };
    };
  };

  @Field(() => DataInput)
  @Column({
    type: 'jsonb'
  })
  data: {
    dataType: AuctionDataType;
    startTime: Date;
    duration: number;
    buyOutPrice: number;
    originFees: {
      account: string;
      value: number;
    };
    payouts: {
      account: string;
      value: number;
    };
  };
}
