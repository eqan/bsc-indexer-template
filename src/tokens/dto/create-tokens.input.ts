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
  @Field()
  tokenId: string;

  @IsNotEmpty({ message: 'Collection contract cannot be null' })
  @IsEthereumAddress()
  @Field()
  collectionId: string;

  @IsString()
  @Field()
  name: string;

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
