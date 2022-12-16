import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType('MetadataAttribute')
@InputType('AttributeInput')
export class MetadataAttribute {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  key?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  value?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  format?: string;
}
