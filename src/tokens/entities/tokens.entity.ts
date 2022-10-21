import { Field, ObjectType } from '@nestjs/graphql';
import { Collections } from 'src/collections/entities/collections.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MetaData } from '../dto/nestedObjectDto/meta.dto';
import { TokenType } from './enum/token.type.enum';

/**Create tokens table in database
 *
 */
@ObjectType()
@Entity('Tokens')
export class Tokens extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  tokenId: string;

  @Field({ nullable: true })
  @Column('text', { default: null })
  collectionId?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  contract?: string;

  @Field()
  @Column({
    type: 'timestamptz',
    default: null,
  })
  mintedAt: Date;

  @Field()
  @Column({
    type: 'timestamptz',
    default: null,
  })
  lastUpdatedAt: Date;

  @Field()
  @Column({
    type: 'boolean',
    default: null,
  })
  deleted: boolean;

  @Field()
  @Column({
    type: 'int',
    default: null,
  })
  sellers: number;

  @Field(() => MetaData)
  @Column({
    type: 'json',
    default: null,
  })
  creator: {
    account: string;
    value: number;
  };

  @Field(() => MetaData)
  @Column({
    type: 'json',
    default: null,
  })
  meta?: {
    name: string;
    description?: string;
    tags?: string[];
    genres?: string[];
    originalMetaUri: string;
    externalUri?: string;
    rightsUri?: string;
    attributes: {
      key: string;
      value: number;
      type?: TokenType;
      format?: string;
    };
    content?: {
      fileName?: string;
      url?: string;
      representation?: string;
      mimeType?: string;
      size?: number;
      available?: boolean;
      type?: string;
      width?: number;
      height?: number;
    };
  };

  @ManyToOne(() => Collections, (collection) => collection.collectionId)
  @JoinColumn({ name: 'collectionId' })
  collection: Collections;
}
