import { Field, InputType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@InputType()
export class DeleteActivityInput {
  @Field(() => [String])
  @IsArray()
  id: string[];
}
