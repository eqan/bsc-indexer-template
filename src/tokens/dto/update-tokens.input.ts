import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

import { CreatorRoyalty } from './nestedObjectDto/creator.dto';
import { MetaData } from './nestedObjectDto/meta.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class UpdateTokensInput {
  @IsNotEmpty()
  @Field()
  tokenId: string;

  @IsOptional()
  @Field({ nullable: true })
  lastUpdatedAt: Date;

  @IsOptional()
  @Field({ nullable: true })
  deleted: boolean;

  @IsOptional()
  @Field({ nullable: true })
  sellers: number;

  @Type(() => CreatorRoyalty)
  @Field(() => CreatorRoyalty, { nullable: true })
  creator: CreatorRoyalty;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetaData)
  @Field(() => MetaData, { nullable: true })
  meta?: MetaData;
}
