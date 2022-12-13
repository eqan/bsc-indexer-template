import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class UpdateUsersInput {
  @IsNotEmpty()
  @IsEthereumAddress({ message: 'User address should be valid' })
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
  @IsUrl()
  @Field()
  websiteUrl: string;

  @IsOptional()
  @IsUrl()
  @Field()
  twitterUrl: string;
}
