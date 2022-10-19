import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ActivityMetaData } from './metadata/activity.metadata.entity';

/*
    @Example: Following is the format example
    "continuation": "1649398291000_624fd21b63c052298d2e43f9",
    "cursor": "ETHEREUM:1649398291000_624fd21b63c052298d2e43f9",
    "activities": []
*/

@ObjectType()
@Entity('Activity')
export class Activity {
  @Field()
  @PrimaryColumn({
    type: 'text',
  })
  continuation: string;

  @Field()
  @Column({type: 'text', nullable: true})
  cursor: string;

  @Field()
  @Column({type: 'array', nullable: true})
  activities: ActivityMetaData[];
}