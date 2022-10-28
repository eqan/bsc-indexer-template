import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString
} from 'class-validator';

@InputType()
export class UpdateUsersInput {
  @IsNotEmpty()
  @IsEthereumAddress({message: "User address should be valid"})
  @Field()
  userAddress: string;

  @IsString()
  @Field()
  userName: string;

  @IsString()
  @Field()
  realName: string;

  @IsString()
  @Field()
  shortBio: string;

  @IsString()
  @Field()
  websiteUrl: string;

  @IsString()
  @Field()
  twitterUrl: string;

}
