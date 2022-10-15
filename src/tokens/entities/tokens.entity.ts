import { Field, ObjectType } from '@nestjs/graphql';
import { Collections } from 'src/collections/entities/collections.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';

/**Create tokens table in database
 *
 */
@ObjectType()
@Entity('Tokens')
export class Tokens extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    nullable: false,
  })
  tokenId: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column({
    type: 'boolean',
  })
  metaDataIndexed: boolean;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  attributes?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  // @ManyToOne(() => Collections, (collection: Collections) => collection.collectionId, {primary: true})
  // @JoinColumn({ name: 'collectionId' })
  // collection: Collections;

  @ManyToOne(() => Collections, (collection) => collection.collectionId)
  @JoinColumn({ name: 'collectionId' }) // <-- Add this
  collection: Collections;
}
