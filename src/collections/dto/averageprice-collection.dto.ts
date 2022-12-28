import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class AveragePriceOutput {
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  averagePrice?: number;
}
