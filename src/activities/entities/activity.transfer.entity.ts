import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';

// @ObjectType()
// @ChildEntity()
export class ActivityTransfer{
  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  tokenId: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  value: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  from: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  owner: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  contract: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  transactionHash: string;

  @Field()
  @Column({
    type: 'boolean',
    nullable: true
  })
  purchase: boolean;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true
  })
  itemId: string;
}
