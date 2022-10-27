import { Field, ObjectType } from '@nestjs/graphql';
import { ChildEntity, Column, Entity, TableInheritance } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityType } from './enums/activity.type.enum';

@ObjectType()
@ChildEntity()
export class ActivityBurn extends Activity {
  @Field()
  @Column({
    type: 'varchar',
  })
  tokenId: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  value: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  owner: string;

  @Field()
  @Column({
    type: 'varchar',
  })
  contract: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
  })
  transactionHash: string;
}
