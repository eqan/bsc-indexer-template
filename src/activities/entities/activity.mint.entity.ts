import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType('ActivityMint')
@InputType('ActivityMintInput')
export class ActivityMint {
  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  tokenId?: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  value?: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  owner?: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  contract?: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  transactionHash?: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  itemId?: string;
}
