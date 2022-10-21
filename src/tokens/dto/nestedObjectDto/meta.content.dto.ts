import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType('MetadataContent')
@InputType('MetadataContentInput')
export class MetadataContent {
  @IsString()
  @IsOptional()
  @Field()
  fileName?: string;

  @IsString()
  @IsOptional()
  @Field()
  url?: string;

  @IsString()
  @IsOptional()
  @Field()
  representation?: string;

  @IsString()
  @IsOptional()
  @Field()
  mimeType?: string;

  @IsNumber()
  @IsOptional()
  @Field()
  size?: number;

  @IsBoolean()
  @IsOptional()
  @Field()
  avaiable?: boolean;

  @IsString()
  @IsOptional()
  @Field()
  type?: string;

  @IsNumber()
  @IsOptional()
  @Field()
  width?: number;

  @IsNumber()
  @IsOptional()
  @Field()
  height?: number;
}
