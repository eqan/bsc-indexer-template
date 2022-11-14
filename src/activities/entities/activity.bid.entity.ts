import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { Make } from 'src/orders/dto/nestedObjectsDto/make.dto';
import { Column } from 'typeorm';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType('ActivityBid')
@InputType('ActivityBidInput')
export class ActivityBid {
  @Field(() => ActivityType)
  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'ActivityType',
    default: ActivityType.BID
  })
  type: ActivityType;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true
  })
  hash: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true
  })
  maker: string;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true
  })
  price?: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true
  })
  priceUsd?: number;

  @Field(() => Make)
  @Column({
    type: 'jsonb',
    nullable: true
  })
  take?: {
    type: {
      type: CollectionType;
      contract: string;
      tokenId: number;
    };
    value: number;
  };

  @Field(() => Make)
  @Column({
    type: 'jsonb',
    nullable: true
  })
  make?: {
    type: {
      type: CollectionType;
      contract: string;
    };
    value?: number;
  };
}
