import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Make } from './nestedActivityObject/make.dto';

@InputType('CreateBidActivityInput')
export class CreateBidActivityInput {
  @ValidateNested()
  @Type(() => Make)
  @IsOptional()
  @Field(() => Make, { nullable: true })
  make?: Make;

  @ValidateNested()
  @Type(() => Make)
  @IsOptional()
  @Field(() => Make, { nullable: true })
  take?: Make;

  @IsOptional()
  @Field({ nullable: true })
  price?: number;

  @IsOptional()
  @Field({ nullable: true })
  priceUsd?: number;
}
