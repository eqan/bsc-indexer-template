import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType('ActivityTransfer')
@InputType('ActivityTransferInput')
export class ActivityTransfer {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  tokenId: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  value: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  from: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  owner: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  contract: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  transactionHash: string;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
  })
  purchase: boolean;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  itemId: string;
}
