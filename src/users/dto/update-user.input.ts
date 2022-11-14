import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

@InputType()
export class UpdateUsersInput {
  @IsNotEmpty()
  @IsEthereumAddress({message: "User address should be valid"})
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  userSignature: string;

  @IsOptional()
  @IsString()
  @Field()
  userName: string;

  @IsOptional()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsString()
  @Field()
  shortBio: string;

  @IsOptional()
  @IsString()
  @Field()
  websiteUrl: string;

  @IsOptional()
  @IsString()
  @Field()
  twitterUrl: string;
}
