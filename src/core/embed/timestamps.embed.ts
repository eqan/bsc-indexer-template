/**
 * Timestamps embed
 *
 * This is for typeorm embed field.
 * It helps to keep track of when a
 * row was created, updated and deleted
 */

import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class Timestamps extends BaseEntity {
  @Field(() => String, { nullable: true })
  @CreateDateColumn({ nullable: true })
  public createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  public lastUpdatedAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  public dbUpdatedAt!: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @Index()
  public deletedAt?: Date;
}
