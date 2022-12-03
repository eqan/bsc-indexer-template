import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
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
  @Field({ nullable: true })
  mintedAt: Date;

  @IsOptional()
  @Field({ nullable: true })
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @Field()
  deleted: boolean;

  @IsNotEmpty()
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
  meta?: MetaData;
}
