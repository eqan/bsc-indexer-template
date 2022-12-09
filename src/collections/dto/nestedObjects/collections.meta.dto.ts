import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CollectionMetaContent } from './collection.meta.content.dto';

@ObjectType('CollectionMeta')
@InputType('CollectionMetaInput')
export class CollectionMeta {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  externalLink?: string;

  @IsOptional()
  @Field({ nullable: true })
  sellerFeeBasisPoints?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  feeRecipient?: string;

  @ValidateNested()
  @Type(() => CollectionMetaContent)
  @Field(() => CollectionMetaContent, { nullable: true })
  Content?: CollectionMetaContent;
}
