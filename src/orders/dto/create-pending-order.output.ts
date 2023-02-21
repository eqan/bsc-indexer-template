import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
@InputType()
export class CreatePendingOrderOutput {
  @IsNotEmpty()
  @IsString()
  @Field()
  transactionHash: string;

  @Field()
  status: string;

  @IsEthereumAddress({ message: 'Order Address  is not ethereum address' })
  @Field()
  address: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  topic: string;
}
