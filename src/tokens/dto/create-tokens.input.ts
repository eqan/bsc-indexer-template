import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Part } from 'src/orders/types/data.types';
import { TokenType } from '../entities/enum/token.type.enum';

import { CreatorRoyalty } from './nestedObjectDto/creator.dto';
import { MetaData } from './nestedObjectDto/meta.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class CreateTokenInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

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
  @Field(() => [Part], { nullable: true })
  creator?: Part[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  signatures?: string[];

  @IsOptional()
  @ValidateNested()
  @Field(() => [Part], { nullable: true })
  royalties?: Part[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  Meta?: MetaData;
}
