import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { type } from 'os';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { Make } from 'src/orders/dto/nestedObjectsDto/make.dto';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType()
@Entity('ActivityBid')
// @InputType('ActivityBidInput')
export class ActivityBid {
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => ActivityType)
  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'ActivityType',
    default: ActivityType.BID,
  })
  type: ActivityType;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  hash: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  maker: string;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  price?: number;

  @Field({ nullable: true })
  @Column({
    type: 'decimal',
    nullable: true,
  })
  priceUsd?: number;

  @Field(() => Make, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  take?: {
    type: {
      type: CollectionType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field(() => Make, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  make?: {
    type: {
      type: CollectionType;
      contract: string;
    };
    value?: number;
  };

  @OneToOne(() => Activity, (activity) => activity.BID)
  activity: Activity;
}
