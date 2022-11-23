import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TokenType } from '../entities/enum/token.type.enum';

import { Creator } from './nestedObjectDto/creator.dto';
import { MetaData } from './nestedObjectDto/meta.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class CreateTokenInput {
  @IsNotEmpty()
  @Field()
  tokenId: string;

  @IsNotEmpty()
  @Field()
  collectionId?: string;

  @IsNotEmpty()
  @Field()
  contract?: string;

  @IsEnum(TokenType)
  @Field(() => TokenType)
  type: TokenType;

  @IsNotEmpty()
  @Field()
  owner?: string;

  @IsOptional()
  @Field()
  mintedAt: Date;

  @Field()
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @Field()
  deleted: boolean;

  @IsNotEmpty()
  @Field()
  sellers: number;

  @ValidateNested()
  @Type(() => Creator)
  @Field(() => Creator)
  creator: Creator;

  @ValidateNested()
  @Type(() => Creator)
  @Field(() => Creator, { nullable: true })
  royalties?: Creator;

  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  meta?: MetaData;
}
