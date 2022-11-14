import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@ArgsType()
@InputType('DeleteAuctionsInput')
export class DeleteAuctionsInput {
  @Field(() => [Int]) id: number[];
}
