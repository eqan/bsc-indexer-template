import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collections } from '../collections.entity';
import { Content } from './collections.meta.content.entity';

@ObjectType()
@Entity('CollectionsMeta')
// @InputType('CollectionsMetaInput')
export class CollectionsMeta {
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => Content, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  Content?: Content;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  externalLink?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  sellerFeeBasisPoints?: number;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  feeRecipient?: string;

  @OneToOne(() => Collections, (collection) => collection.Meta)
  collection: Collections;
}
