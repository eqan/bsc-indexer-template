import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { CollectionType, CollectionFeature } from './enum/collection.type.enum';
import { CollectionsMeta } from './nestedObjects/collections.meta.entity';

@ObjectType()
@Entity('Collections')
@Index(['name', 'type', 'owner'])
export class Collections extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    transformer: {
      to(value) {
        return value.toLowerCase();
      },
      from(value) {
        return value;
      },
    },
  })
  id: string;

  @Field({ nullable: true })
  @Column('text')
  name: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  symbol?: string;

  @Field()
  @Column({
    type: 'enum',
    enum: CollectionType,
    enumName: 'CollectionType',
  })
  type: CollectionType;

  @Field(() => [CollectionFeature])
  @Column({
    array: true,
    type: 'enum',
    enum: CollectionFeature,
    enumName: 'CollectionFeature',
    default: [],
  })
  features: CollectionFeature[];

  @Field({ nullable: true })
  @Column({
    type: 'text',
  })
  owner?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  twitterUrl?: string;

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

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  bannerImageUrl?: string;

  @IsOptional()
  @Field(() => CollectionsMeta, { nullable: true })
  @OneToOne(() => CollectionsMeta, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  Meta?: CollectionsMeta;

  @OneToMany(() => Tokens, (token) => token.tokenId)
  tokens: Tokens[];
}
