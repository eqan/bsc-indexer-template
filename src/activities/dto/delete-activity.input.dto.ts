import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType('DeleteActivityInput')
export class DeleteActivityInput {
  @Field(() => [String]) id: string[];
}
