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
import { PartDto } from 'src/core/dto/part.dto';
import { TokenType } from '../entities/enum/token.type.enum';

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
  @Field(() => [PartDto], { nullable: true })
  creator?: PartDto[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  signatures?: string[];

  @IsOptional()
  @ValidateNested()
  @Field(() => [PartDto], { nullable: true })
  royalties?: PartDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  Meta?: MetaData;
}
