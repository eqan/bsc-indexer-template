import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType('UsdPrice')
@Entity('UsdPrice')
export abstract class UsdPrice extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field({ nullable: true })
  @Column('text')
  currency: string;

  @Field()
  @Column('text')
  value: string;

  @Field()
  @Column('int')
  timestamp: number;

  // @Field({ nullable: true })
  // @Column('text')
  // name: string;

  // @Field(() => CurrencyMetaData, { nullable: true })
  // @Column({
  //   type: 'jsonb',
  //   nullable: true,
  // })
  // metadata?: {
  //   coingeckoCurrencyId?: string;
  //   image?: string;
  // };
}
