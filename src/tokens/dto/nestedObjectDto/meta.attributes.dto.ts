import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';

@ObjectType('MetadataAttribute')
@InputType('AttributeInput')
export class MetadataAttribute {
  @Field()
  key: string;

  @Field()
  value: string;

  @IsOptional()
  @Field({ nullable: true })
  format?: string;
}
