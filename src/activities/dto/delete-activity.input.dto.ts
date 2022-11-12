import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@ArgsType()
@InputType('DeleteActivityInput')
export class DeleteActivityInput {
  @IsEthereumAddress()
  @Field(() => [String]) id: string[];
}
