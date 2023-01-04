import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MetadataAttribute } from '../../dto/nestedObjectDto/meta.attributes.dto';
import { Tokens } from '../tokens.entity';
import { TokensAttributes } from './tokens.meta.attributes.entity';
import { Content } from './tokens.meta.content.entity';

@ObjectType('Meta')
@Entity('TokensMeta')
export class TokensMeta {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => Content, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  Content?: Content;

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true, default: [] })
  tags?: string[];

  @Field(() => [String], { nullable: true })
  @Column('text', { array: true, nullable: true, default: [] })
  genres?: string[];

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  originalMetaUri?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  externalUri?: string;

  // @Field(() => [MetadataAttribute], { nullable: true })
  // @Column('jsonb', {
  //   nullable: true,
  //   default: null,
  // })
  // attributes?: {
  //   key?: string;
  //   value?: string;
  //   format?: string;
  // }[];

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  rightsUri?: string;

  @OneToOne(() => Tokens, (token) => token.Meta)
  token: Tokens;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  attributeId?: string;

  @OneToMany(() => TokensAttributes, (attributes) => attributes.id)
  @JoinColumn({ name: 'attributeId' })
  attributes: TokensAttributes[];
}
