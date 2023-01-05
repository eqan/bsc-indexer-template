import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { Collections } from 'src/collections/entities/collections.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType('Stats')
@Entity('StatsInput')
export abstract class Stats extends BaseEntity {
  @Field({ nullable: true })
  @IsEthereumAddress()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field({ nullable: true })
  @Column('int')
  dayVolume: number;

  @Field({ nullable: true })
  @Column('float')
  floorPrice: number;

  @Field(() => Collections)
  @OneToOne(() => Collections, (collection) => collection.id)
  @JoinColumn({ name: 'id' })
  collection: Collections;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = this.collection.id;
    }
  }
}
