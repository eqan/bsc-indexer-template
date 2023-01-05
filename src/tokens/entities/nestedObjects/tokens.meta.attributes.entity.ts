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
  @Column('text', { nullable: true })
  tokenId: string;

  @Field()
  @Column('text', { nullable: true })
  collectionId: string;

  @Field()
  @Column('text', { nullable: true })
  key: string;

  @Field()
  @Column('text', { nullable: true })
  format: string;

  @Field()
  @Column('text', { nullable: true })
  value: string;

  @ManyToOne(() => TokensMeta, (meta) => meta.attributes, { cascade: true })
  // @JoinColumn({ name: 'id' })
  tokensMeta: TokensMeta;
}
