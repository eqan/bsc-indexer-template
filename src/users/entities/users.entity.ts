import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { UserTypes } from './enum/user.types.enums';

/**Create users table in database
 *
 */
@ObjectType()
@Entity('Users')
@Unique(['id', 'userSignature', 'userName'])
@Index(['id', 'type', 'userSignature'])
export class Users extends BaseEntity {
  @Field()
  @IsEthereumAddress({ message: 'User address should be valid' })
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  id: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  userSignature: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  userName: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  shortBio: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  websiteUrl: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  twitterUrl: string;

  @Field({ nullable: true })
  @Column({
    type: 'enum',
    enumName: 'UserTypeEnum',
    enum: UserTypes,
    default: UserTypes.REGULARUSER,
  })
  type: UserTypes;
}
