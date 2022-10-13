import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

@InputType('UpdateTokensInput')
export class UpdateTokensInput {
  @IsNotEmpty({ message: 'Token Contract cannot be null' })
  @IsEthereumAddress({ message: 'Token Contract Must be a Ethereum Address' })
  @Field()
  tokenContract!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  collectionId?: string;

  @Field({
    nullable: true,
  })
  description?: string;

  @IsString()
  @IsUrl({ message: 'Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  imageUrl?: string;
}
