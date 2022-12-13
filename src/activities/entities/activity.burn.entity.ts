import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('ActivityBurn')
export class ActivityBurn {
  @PrimaryGeneratedColumn()
  id: string;

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
    // unique: true,
    nullable: true,
  })
  transactionHash: string;
}
