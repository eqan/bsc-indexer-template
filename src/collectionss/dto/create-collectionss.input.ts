import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

/**Create Collectionss table in database
 *
 */

@InputType()
// @ObjectType()
export class CreateCollectionssInput {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress()
  @Field()
  collection_id: string;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  slug: string;

  @IsString()
  @IsUrl()
  @Field({
    nullable: true,
  })
  bannerImageUrl: string;

  @IsString()
  @IsUrl()
  @Field({
    nullable: true,
  })
  externalUrl: string;

  @IsUrl()
  @Field({
    nullable: true,
  })
  ImageUrl: string;

  @IsString()
  @Field({
    nullable: true,
  })
  twitterUserName: string;

  @IsUrl()
  @Field({
    nullable: true,
  })
  discordUrl: string;

  @Field({
    nullable: true,
  })
  description: string;
}
