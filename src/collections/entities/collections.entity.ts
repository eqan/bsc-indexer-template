import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Collections')
export class Collections {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  collectionId: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  slug: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  bannerImageUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  externalUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  twitterUserName?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  discordUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;
}
