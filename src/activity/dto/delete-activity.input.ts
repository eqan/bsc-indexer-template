import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteActivityInput {
  @Field(() => [String]) id: string[];
}