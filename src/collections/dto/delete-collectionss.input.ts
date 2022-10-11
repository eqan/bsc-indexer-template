import { CreateCollectionsInput } from './create-collections.input';
import { ArgsType, Field, InputType, PickType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteCollectionsInput {
  @Field(() => [String]) id: string[];
}
