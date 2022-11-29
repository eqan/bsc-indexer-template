import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserTypes } from '../entities/enum/user.types.enums';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  userSignature: string;

  @IsNotEmpty()
  @IsEthereumAddress({ message: 'User address should be valid' })
  @Field()
  id: string;

  @IsNotEmpty()
  @IsEnum(UserTypes)
  @Field(() => UserTypes)
  type: UserTypes;
}
