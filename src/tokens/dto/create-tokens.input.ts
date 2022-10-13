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

@InputType('CreateTokensInput')
export class CreateTokensInput {
  @IsNotEmpty({ message: 'token contract cannot be null' })
  @IsEthereumAddress()
  @Field()
  tokenContract: string;

  @IsNotEmpty({ message: 'Id contract cannot be null' })
  @IsString()
  @Field()
  tokenId: string;

  @IsString()
  @Field()
  name: string;

  @IsNotEmpty({ message: 'Collection Id cannot be null' })
  @IsString()
  @Field()
  collectionId: string;

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
