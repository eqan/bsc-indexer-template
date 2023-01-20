import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ObjectType()
@InputType('EthAssetDto')
export class EthAssetDto {
  @IsString()
  @Field()
  value: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  valueDecimal?: string;
}
