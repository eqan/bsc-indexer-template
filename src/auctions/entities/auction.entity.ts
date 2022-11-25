import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DataInput } from '../dto/nestedObjects/data.json.dto';
import { LastBid } from '../dto/nestedObjects/lastBid.json.dto';
import { Sell } from '../dto/nestedObjects/sell.json.dto';
import { SellTypeDto } from '../dto/nestedObjects/sell.type.json.dto';
import { AuctionDataType, AuctionStatus, AuctionType } from './enums/enums';

@ObjectType()
@Entity('Auction')
export class Auction {
  @Field({ nullable: true })
  @PrimaryColumn({
    type: 'decimal',
    unique: true,
  })
  auctionId: number;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  contract: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  seller: string;

  @Field(() => AuctionType)
  @Column({
    type: 'enum',
    enum: AuctionType,
    enumName: 'AuctionType',
    default: AuctionType.BEP721,
    nullable: true,
  })
  type: AuctionType;

  @Field(() => Sell)
  @Column({
    type: 'jsonb',
    nullable: true,
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
    type: 'jsonb',
    nullable: true,
  })
  buy: {
    type: string;
    contract: string;
    tokenId: string;
  };

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  endTime: Date;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  minimalStep: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  minimalPrice: number;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  buyPrice: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  buyPriceUsd: number;

  // @Field()
  // @Column()
  // pending:{}

  @Field(() => AuctionStatus)
  @Column({
    type: 'enum',
    nullable: true,
    enum: AuctionStatus,
    enumName: 'AuctionStatus',
    default: AuctionStatus.ACTIVE,
  })
  status: AuctionStatus;

  @Field()
  @Column({
    type: 'boolean',
    nullable: true,
  })
  ongoing: boolean;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  hash: string;

  @Field(() => LastBid)
  @Column({
    type: 'jsonb',
    nullable: true,
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
    type: 'jsonb',
    nullable: true,
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
