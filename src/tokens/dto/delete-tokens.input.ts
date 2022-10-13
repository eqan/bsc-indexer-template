import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType('DeleteTokensInput')
export class DeleteTokensInput {
  @Field(() => [String]) id: string[];
}
