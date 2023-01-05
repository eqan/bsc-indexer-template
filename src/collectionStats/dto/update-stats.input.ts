import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { CreateStatsInput } from './create-stats.input';

@InputType()
export class UpdateActivityInput extends PartialType(CreateStatsInput) {
  @IsEthereumAddress()
  @Field()
  id: string;
}
