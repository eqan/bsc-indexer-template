import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';
// {
//     "hash": "string",
//     "from": "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
//     "nonce": 0,
//     "to": "0x60f80121c31a0d46b5279700f9df786054aa5ee5",
//     "input": "string"
//   }

@ArgsType()
@InputType()
export class CreatePendingOrderInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  hash: string;

  @IsEthereumAddress({ message: 'From Address is not ethereum address' })
  @Field()
  from: string;

  @IsEthereumAddress({ message: 'Order Address  is not ethereum address' })
  @Field()
  to: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  input: string;
}
