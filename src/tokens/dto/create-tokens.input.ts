import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Collections } from 'src/collections/entities/collections.entity';

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
  @Type(() => MetaData)
  @Field(() => MetaData)
  meta?: MetaData;
}
