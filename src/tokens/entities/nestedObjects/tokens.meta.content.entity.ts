import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType()
// @InputType('MetaContentInput')
export class Content {
  @Field({ nullable: true })
  @Column('text', { nullable: true })
  fileName?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  representation?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  mimeType?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  type?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  url?: string;

  @Field({ nullable: true })
  @Column('int', { nullable: true })
  size?: number;

  @Field({ nullable: true })
  @Column('bool', { nullable: true })
  available?: boolean;

  @Field({ nullable: true })
  @Column('int', { nullable: true })
  width?: number;

  @Field({ nullable: true })
  @Column('int', { nullable: true })
  height?: number;
}
