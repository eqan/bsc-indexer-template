import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

@ObjectType('MetadataContent')
@InputType('MetadataContentInput')
export class MetadataContent {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fileName?: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  representation?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  mimeType?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  size?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  avaiable?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  type?: string;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  width?: number;

  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  height?: number;
}
