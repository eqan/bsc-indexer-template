import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';

@ObjectType('MetadataAttribute')
@InputType('AttributeInput')
export class MetadataAttribute {
  @IsOptional()
  @Field({ nullable: true })
  key?: string;

  @IsOptional()
  @Field({ nullable: true })
  value?: string;

  @IsOptional()
  @Field({ nullable: true })
  format?: string;
}
