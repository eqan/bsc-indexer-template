import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { CreateActivityInput } from './create-activity.input';

@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) {
  @IsEthereumAddress()
  @Field()
  id: string;
}
