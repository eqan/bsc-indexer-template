import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Collections } from 'src/collections/entities/collections.entity';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CreatorRoyalty } from '../dto/nestedObjectDto/creator.dto';
import { TokenType } from './enum/token.type.enum';
import { TokensMeta } from './nestedObjects/tokens.meta.entity';

@ObjectType()
@Entity('Tokens')
export class Tokens extends Timestamps {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

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

  @Field(() => CreatorRoyalty, { nullable: true })
  @Column({
    type: 'jsonb',
    default: null,
  })
  creator?: {
    account?: string[];
    value?: number;
  };

  @Field(() => CreatorRoyalty, { nullable: true })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  royalties?: {
    account?: string[];
    value?: number;
  };

  @IsOptional()
  @Field(() => TokensMeta, { nullable: true })
  @OneToOne(() => TokensMeta, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  Meta?: TokensMeta;

  @ManyToOne(() => Collections, (collection) => collection.id)
  @JoinColumn({ name: 'collectionId' })
  collection: Collections;
}
