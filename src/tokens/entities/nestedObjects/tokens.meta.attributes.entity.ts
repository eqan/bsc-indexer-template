import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokensMeta } from './tokens.meta.entity';

@ObjectType('Attributes')
@Entity('TokensAttributes')
export class TokensAttributes {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  tokenId: string;

  @Field()
  @Column('text')
  key: string;

  @Field()
  @Column('text', { nullable: true })
  parent: string;

  @Field()
  @Column('text')
  format: string;

  @Field()
  @Column('text')
  value: string;

  @ManyToOne(() => TokensMeta, (meta) => meta.id)
  @JoinColumn({ name: 'id' })
  tokensMeta: TokensMeta;
}
