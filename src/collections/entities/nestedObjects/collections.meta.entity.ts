import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collections } from '../collections.entity';
import { Content } from './collections.meta.content.entity';

@ObjectType()
@Entity('CollectionsMeta')
// @InputType('CollectionsMetaInput')
export class CollectionsMeta extends Timestamps {
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

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
  feeRecipient?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  sellerFeeBasisPoints?: number;

  @IsOptional()
  @Field(() => Content, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  Content?: Content;

  @OneToOne(() => Collections, (collection) => collection.Meta, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  collection: Collections;

  @Field()
  @Column({
    transformer: {
      to(value) {
        return value.toLowerCase();
      },
      from(value) {
        return value;
      },
    },
    unique: true,
    type: 'text',
  })
  collectionId: string;

  // @OneToOne(() => Collections, (collection) => collection.Meta)
  // collection: Collections;

  // @IsOptional()
  // @Field(() => CollectionsMeta, { nullable: true })
  // @OneToOne(
  //   () => CollectionsMeta,
  //   (collectionMeta) => collectionMeta.collection,
  //   {
  //     eager: true,
  //     cascade: true,
  //     nullable: true,
  //   },
  // )
  // @JoinColumn()
  // Meta?: CollectionsMeta;
}
