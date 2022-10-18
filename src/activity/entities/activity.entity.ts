import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ActivityMetaData } from './metadata/activity.metadata.entity';

/*
    "continuation": "1649398291000_624fd21b63c052298d2e43f9",
    "cursor": "ETHEREUM:1649398291000_624fd21b63c052298d2e43f9",
    "activities": []
*/

@ObjectType()
@Entity('Orders')
export class Orders {
  @Field()
  @PrimaryColumn({
    type: 'text',
  })
  continuation: string;

  @Field()
  @Column({type: 'text'})
  cursor: string;

  @Field()
  @Column({nullable: true})
  activities: ActivityMetaData[];

}