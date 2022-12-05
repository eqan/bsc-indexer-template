import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@ObjectType('CollectionMetaContent')
@InputType('CollectionMetaContentInput')
export class CollectionMetaContent {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  type?: string;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  url: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  representation?: string;
}
