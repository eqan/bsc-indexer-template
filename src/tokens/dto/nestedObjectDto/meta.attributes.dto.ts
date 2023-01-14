import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
@InputType('TokensAttributes')
export class TokensAttributesInput {
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

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  tokenId?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  collectionId?: string;
}
