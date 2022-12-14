import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsNull } from 'typeorm';

import { CreatorRoyalty } from './nestedObjectDto/creator.dto';
import { MetaData } from './nestedObjectDto/meta.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class UpdateTokensInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  tokenId: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  lastUpdatedAt: Date;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  deleted: boolean;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  sellers: number;

  @IsOptional()
  @Type(() => CreatorRoyalty)
  @Field(() => CreatorRoyalty, { nullable: true })
  creator: CreatorRoyalty;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  Meta?: MetaData;
}
