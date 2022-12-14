import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @IsEthereumAddress({ message: 'User address must be valid' })
  @Field()
  id: string;

  @IsString()
  @Field()
  userSignature: string;

  @IsString()
  @Field()
  userMessage: string;
}
