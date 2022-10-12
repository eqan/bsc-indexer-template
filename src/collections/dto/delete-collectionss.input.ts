import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteCollectionsInput {
  @Field(() => [String]) id: string[];
}
