import { Field, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import {
  BaseEntity, Column, Entity, PrimaryColumn, Unique
} from 'typeorm';
import { UserTypes } from './enum/user.types.enums';

/**Create users table in database
 *
 */
@ObjectType()
@Entity('Users')
@Unique(["userId", "userSignature", "userName"])
export class Users extends BaseEntity {

  @Field()
  @IsEthereumAddress({message: "User address should be valid"})
  @PrimaryColumn({
    type: 'text',
    unique: true,
  })
  userId: string

  @Field()
  @Column({type: 'text'})
  userSignature: string

  @Field()
  @Column({type: 'text', nullable: true})
  name: string
  
  @Field()
  @Column({type: 'text', nullable: true})
  userName: string

  @Field()
  @Column({type: 'text', nullable: true})
  shortBio: string

  @Field()
  @Column({type: 'text', nullable: true})
  websiteUrl: string

  @Field()
  @Column({type: 'text', nullable: true})
  twitterUrl: string

  @Field()
  @Column({
    type: 'enum',
    enumName: 'UserTypeEnum',
    enum: UserTypes,
    default: UserTypes.REGULARUSER
  })
  type: UserTypes;
}
