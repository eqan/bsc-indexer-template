import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType('MetadataContent')
@InputType('MetadataContentInput')
export class MetadataContent {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  fileName?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  url?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  representation?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  mimeType?: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  size?: number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  avaiable?: boolean;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  type?: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  width?: number;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  height?: number;
}
