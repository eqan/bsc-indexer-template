import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { Creator } from './nestedObjectDto/creator.dto';
import { MetaData } from './nestedObjectDto/meta.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class UpdateTokensInput {
  @IsNotEmpty()
  @Field()
  tokenId: string;

  @IsNotEmpty()
  @Field()
  lastUpdatedAt: Date;

  @IsNotEmpty()
  @Field()
  deleted: boolean;

  @IsNotEmpty()
  @Field()
  sellers: number;

  @Type(() => Creator)
  @Field(() => Creator)
  creator: Creator;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData)
  meta?: MetaData;
}
