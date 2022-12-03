import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType('ActivityMint')
@InputType('ActivityMintInput')
export class ActivityMint {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  tokenId?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  value?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  owner?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  contract?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  transactionHash?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  itemId?: string;
}
