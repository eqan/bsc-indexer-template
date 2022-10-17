import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

/**Create tokens table in database
 *
 */

@InputType('CreateTokenInput')
export class CreateTokenInput {
  @IsNotEmpty({ message: 'token contract cannot be null' })
  @IsEthereumAddress()
  @Field()
  tokenId: string;

  @IsNotEmpty({ message: 'Collection contract cannot be null' })
  @IsEthereumAddress()
  @Field()
  collectionId: string;

  @IsString()
  @Field()
  name: string;

  // // @IsNotEmpty({ message: 'Collection Id cannot be null' })
  // // @IsString()
  // // @Field()
  // // collectionId: string;

  @IsBoolean()
  @Field()
  metaDataIndexed: boolean;

  @IsString()
  @IsUrl()
  @Field({
    nullable: true,
  })
  imageUrl?: string;

  @IsString()
  @Field({
    nullable: true,
  })
  attributes?: string;

  @IsString()
  @Field({
    nullable: true,
  })
  description?: string;
}
