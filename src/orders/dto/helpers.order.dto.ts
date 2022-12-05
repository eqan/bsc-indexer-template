import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Make } from './nestedObjectsDto/make.dto';

@InputType()
export class CreateSignatureInput {
  @IsEthereumAddress({ message: 'Order ID should be an ethereum address' })
  @IsNotEmpty({ message: 'Order ID cannot be null' })
  @Field()
  orderId: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  maker: string;

  @ValidateNested()
  @Type(() => Make)
  @Field(() => Make)
  Make: Make;

  @ValidateNested()
  @Type(() => Make)
  @Field()
  Take: Make;

  @IsString()
  @IsNotEmpty()
  @Field()
  salt: string;
}
