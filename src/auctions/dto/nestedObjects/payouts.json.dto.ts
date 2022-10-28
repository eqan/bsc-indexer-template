import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

@ObjectType('Payouts')
@InputType('PayoutsInput')
export class Payouts {
  @IsEthereumAddress()
  @Field(() => String)
  account: string;

  @IsNotEmpty()
  @Field()
  value: number;
}
