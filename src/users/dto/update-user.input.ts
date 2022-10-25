import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsUrl,
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


  @IsString()
  @IsUrl({ message: 'Banner Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  bannerImageUrl?: string;

  @IsString()
  @IsUrl({ message: 'External URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  externalUrl?: string;

  @IsUrl({ message: 'Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  imageUrl?: string;

  @IsString({ message: 'Twitter User Name must be String' })
  @Field({
    nullable: true,
  })
  twitterUserName?: string;

  @IsUrl({ message: 'Discord URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  discordUrl?: string;

  @Field({
    nullable: true,
  })
  description?: string;
}
