import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';


@InputType()
export class CreateUserOnLoginInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  userSignature: string;

  @IsNotEmpty()
  @IsEthereumAddress({message: "User address should be valid"})
  @Field()
  id: string;
}