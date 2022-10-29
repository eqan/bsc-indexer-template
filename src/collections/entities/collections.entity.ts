import { Field, ObjectType } from '@nestjs/graphql';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CollectionType } from './enum/collection.type.enum';

@ObjectType()
@Entity('Collections')
export class Collections {
  @Field()
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  collectionId: string;

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

  // @Field()
  // @Column('text')
  // features: CollectionType;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  parent?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  symbol?: string;

  // @Field()
  // @Column({
  //   type: 'text',
  //   nullable: true,
  // })
  // minters?: string;

  @Field()
  @Column({
    type: 'text',
    nullable: true,
  })
  owner?: string;

  @Field()
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  meta?: {
    name?: string;
    description?: string;
    // tags?: string
    // genres?: string
    content: {
      type?: string;
      url?: string;
      representation?: string;
    };
    externalLink?: string;
    sellerFeeBasisPoints?: number;
    feeRecipient?: string;
  };

  @OneToMany(() => Tokens, (token) => token.tokenId)
  tokens: Tokens[];
}
