import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { MetadataAttribute } from './meta.attributes.dto';
import { MetadataContent } from './meta.content.dto';

@ObjectType('MetaData')
@InputType('MetaDataInput')
export class MetaData {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  description: string;

  @IsString()
  @Field(() => [String], { nullable: null })
  tags?: string[];

  @IsString()
  @Field(() => [String])
  genres?: string[];

  @IsString()
  @Field(() => String)
  originalMetaUri: string;

  @IsString()
  @Field(() => String)
  externalUri?: string;

  @IsString()
  @Field(() => String, { nullable: true })
  rightsUri?: string;

  @ValidateNested()
  @Type(() => MetadataAttribute)
  @Field(() => MetadataAttribute, { nullable: true })
  attribute?: MetadataAttribute[];

  @ValidateNested()
  @Type(() => MetadataContent)
  @Field(() => MetadataContent, { nullable: true })
  content?: MetadataContent;
}
