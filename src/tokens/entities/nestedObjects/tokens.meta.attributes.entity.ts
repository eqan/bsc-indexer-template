import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokensMeta } from './tokens.meta.entity';

@ObjectType('Attributes')
@Entity('TokensAttributes')
export class TokensAttributes {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn()
  id?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  tokenId: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  collectionId: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  key: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  format: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  value: string;

  @ManyToOne(() => TokensMeta, (meta) => meta.attributes, {
    cascade: true,
    nullable: true,
  })
  // @JoinColumn({ name: 'id' })
  tokensMeta: TokensMeta;
}
