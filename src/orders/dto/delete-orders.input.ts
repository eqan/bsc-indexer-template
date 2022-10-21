import { ArgsType, Field, InputType } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class DeleteOrderInput {
  @Field(() => [String]) id: string[];
}
