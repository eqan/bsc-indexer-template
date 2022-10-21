import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';

@InputType('CreatorInput')
@ObjectType('Creator')
export class Creator {
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  account?: string;

  @IsOptional()
  @Field(() => Int)
  value?: number;
}
