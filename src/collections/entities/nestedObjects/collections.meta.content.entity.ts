import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType('MetaContent')
@InputType('MetaContentInput')
export class Content {
  @Field({ nullable: true })
  @Column('text', { nullable: true })
  type?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  url: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  representation?: string;
}
