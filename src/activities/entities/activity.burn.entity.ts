import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

// @ObjectType()
// @ChildEntity()
export class ActivityBurn{
  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })

  tokenId: string;

  @Field()
  @IsOptional()
  @Column({
    type: 'varchar',
    nullable: true
  })
  // @Column()
  value: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  // @Column()
  owner: string;

  @Field()
  @Column({
    type: 'varchar',
    nullable: true
  })
  // @Column()
  contract: string;

  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true
  })
  transactionHash: string;
}
