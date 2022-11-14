import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteUsersInput {
  @Field(() => [String]) id: string[];
}

