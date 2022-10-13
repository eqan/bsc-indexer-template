import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

/**Create tokens table in database
 *
 */
@ObjectType()
@Entity('tokens')
export class Tokens extends BaseEntity {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  tokenContract: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  tokenId: string;

  @Field()
  @Column('text')
  collectionId: string;

  @Field()
  @Column({
    type: 'boolean',
  })
  metaDataIndexed: boolean;

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
  attributes?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;
}
