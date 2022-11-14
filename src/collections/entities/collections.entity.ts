import { Field, ObjectType } from '@nestjs/graphql';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity('Collections')
export class Collections {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true
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
    nullable: true
  })
  bannerImageUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true
  })
  externalUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true
  })
  imageUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true
  })
  twitterUserName?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true
  })
  discordUrl?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @OneToMany(() => Tokens, (token) => token.tokenId)
  tokens: Tokens[];
}
