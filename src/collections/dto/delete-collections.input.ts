import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteCollectionsInput {
  @Field(() => [String]) id: string[];
}
