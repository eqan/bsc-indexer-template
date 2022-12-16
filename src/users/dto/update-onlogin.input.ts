import { Field, InputType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateUserOnLoginInput {
  @IsNotEmpty()
  @IsEthereumAddress({ message: 'User address must be valid' })
  @Field()
  id: string;

  @IsOptional()
  @IsString()
  @Field()
  userSignature: string;

  @IsOptional()
  @IsString()
  @Field()
  userMessage: string;
}
