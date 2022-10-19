import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNumber } from 'class-validator';

@ObjectType("DataOriginFee")
@InputType("DataOrginFeeInput")
export class DataOriginFee {
  @IsEthereumAddress()
  @Field()
  account: string;

  @IsNumber()
  @Field(()=>Int)
  value: number;


  
}
