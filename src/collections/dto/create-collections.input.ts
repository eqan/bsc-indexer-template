import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType()
export class CreateCollectionsInput {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  collectionId: string;

  @IsString({ message: 'Name must be a String' })
  @Field()
  name: string;

  @IsString({ message: 'Slug must be String' })
  @Field()
  slug: string;

  @IsString()
  @IsUrl({ message: 'Banner Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  bannerImageUrl: string;

  @IsString()
  @IsUrl({ message: 'External URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  externalUrl: string;

  @IsUrl({ message: 'Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  imageUrl: string;

  @IsString({ message: 'Twitter User Name must be String' })
  @Field({
    nullable: true,
  })
  twitterUserName: string;

  @IsUrl({ message: 'Discord URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  discordUrl: string;

  @Field({
    nullable: true,
  })
  description: string;
}
