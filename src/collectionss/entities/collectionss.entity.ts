import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

/**Create Collectionss table in database
 *
 */
@ObjectType()
@Entity()
export class Collectionss extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
    nullable: false,
  })
  collection_id: string;

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
  bannerImageUrl: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  externalUrl: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  ImageUrl: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  twitterUserName: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  discordUrl: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
}
