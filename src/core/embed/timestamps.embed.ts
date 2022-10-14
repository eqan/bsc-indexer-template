/**
 * Timestamps embed
 *
 * This is for typeorm embed field.
 * It helps to keep track of when a
 * row was created, updated and deleted
 */

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class Timestamps {
  @Field(() => String)
  @CreateDateColumn()
  public createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  public updatedAt!: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @Index()
  public deletedAt?: Date;
}
