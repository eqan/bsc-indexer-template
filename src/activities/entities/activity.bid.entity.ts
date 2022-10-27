import { Field, ObjectType } from '@nestjs/graphql';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { Make } from 'src/orders/dto/nestedObjectsDto/make.dto';
import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType()
@ChildEntity()
export class ActivityBid extends Activity {
  @Field(() => ActivityType)
  @Column({
    type: 'enum',
    enum: ActivityType,
    enumName: 'ActivityType',
    default: ActivityType.BID,
  })
  type: ActivityType;

  @Field()
  @Column({
    type: 'varchar',
  })
  hash: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  maker: string;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  price?: number;

  @Field()
  @Column({
    type: 'decimal',
    nullable: true,
  })
  priceUsd?: number;

  @Field(() => Make)
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

  @Field(() => Make)
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
}
