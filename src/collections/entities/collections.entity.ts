import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CollectionType } from './enum/collection.type.enum';
import { CollectionsMeta } from './nestedObjects/collections.meta.entity';

@ObjectType()
@Entity('Collections')
export class Collections {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column({
    type: 'enum',
    enum: CollectionType,
    enumName: 'CollectionType',
    default: CollectionType.BEP721,
  })
  type: CollectionType;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  parent?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  symbol?: string;

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
  twitterUserName?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  discordUrl?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @IsOptional()
  @Field(() => CollectionsMeta, { nullable: true })
  @Column({ nullable: true, type: 'jsonb' })
  Meta: CollectionsMeta;

  @OneToMany(() => Tokens, (token) => token.tokenId)
  tokens: Tokens[];
}
