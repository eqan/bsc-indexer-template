import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { MetadataAttribute } from './meta.attributes.dto';
import { MetadataContent } from './meta.content.dto';

@ObjectType()
@InputType('MetaDataInput')
export class MetaData {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  tags?: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  genres?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  originalMetaUri: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  externalUri?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  rightsUri?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataAttribute)
  @Field(() => [MetadataAttribute], { nullable: true })
  attributes?: MetadataAttribute[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataContent)
  @Field(() => MetadataContent, { nullable: true })
  Content?: MetadataContent;
}
