import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

@ObjectType('ActivityBurn')
@InputType('ActivityBurnInput')
export class ActivityBurn {
  @Field()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  tokenId: string;

  @Field({ nullable: true })
  @IsOptional()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  // @Column()
  value: string;

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
    unique: true,
    nullable: true,
  })
  transactionHash: string;
}
