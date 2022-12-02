import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Collections } from 'src/collections/entities/collections.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Creator } from '../dto/nestedObjectDto/creator.dto';
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

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  contract?: string;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enum: TokenType,
    enumName: 'TokenType',
    default: TokenType.BEP721,
  })
  type: TokenType;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  owner?: string;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    default: null,
  })
  mintedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamptz',
    default: null,
  })
  lastUpdatedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    default: null,
  })
  deleted: boolean;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    default: null,
  })
  sellers: number;

  @Field(() => Creator, { nullable: true })
  @Column({
    type: 'json',
    default: null,
  })
  creator?: {
    account?: string[];
    value?: number;
  };

  @Field(() => [Creator], { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  royalties?: {
    account?: string[];
    value?: number;
  };

  @Field(() => MetaData, { nullable: true })
  @Column({
    type: 'json',
    default: null,
    nullable: true,
  })
  meta?: {
    name: string;
    description?: string;
    tags?: string[];
    genres?: string[];
    originalMetaUri?: string;
    externalUri?: string;
    rightsUri?: string;
    attributes?: {
      key?: string;
      value?: number;
      format?: string;
    }[];
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

  @ManyToOne(() => Collections, (collection) => collection.id)
  @JoinColumn({ name: 'collectionId' })
  collection: Collections;
}
