import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';

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
