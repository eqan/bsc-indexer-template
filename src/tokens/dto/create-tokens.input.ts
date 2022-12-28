import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TokenType } from '../entities/enum/token.type.enum';

import { MetaData } from './nestedObjectDto/meta.dto';
import { CreatorRoyalty } from './nestedObjectDto/creator.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class CreateTokenInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  tokenId: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  collectionId: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsEnum(TokenType)
  @IsNotEmpty()
  @Field(() => TokenType)
  type: TokenType;

  @IsEthereumAddress()
  @Field({ nullable: true })
  owner?: string;

  @IsOptional()
  @Field({ nullable: true })
  mintedAt?: Date;

  // @IsOptional()
  // @IsDate()
  // @Field({ nullable: true })
  // lastUpdatedAt?: Date;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  deleted: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  sellers: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatorRoyalty)
  @Field(() => CreatorRoyalty, { nullable: true })
  creator?: CreatorRoyalty;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatorRoyalty)
  @Field(() => CreatorRoyalty, { nullable: true })
  royalties?: CreatorRoyalty;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  Meta?: MetaData;
}
