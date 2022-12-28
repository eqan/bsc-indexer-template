import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class VolumeOutput {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  volume?: number;
}
