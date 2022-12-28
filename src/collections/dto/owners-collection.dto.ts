import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UniqueOwnersOuput {
  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  owners?: number;
}
