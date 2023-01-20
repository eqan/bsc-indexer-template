import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { Collections } from 'src/collections/entities/collections.entity';
import { PartDto } from 'src/core/dto/part.dto';
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
    type: 'text',
    nullable: true,
  })
  uri?: string;

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

  @Field({ nullable: true })
  @Column({
    type: 'int',
    default: null,
  })
  lazySupply: number;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    default: null,
  })
  supply: number;

  @IsOptional()
  @ValidateNested()
  @Field(() => [PartDto], { nullable: true })
  creators: PartDto[];

  @IsOptional()
  @ValidateNested()
  @Field(() => [PartDto], { nullable: true })
  royalties: PartDto[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  signatures: string[];

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
