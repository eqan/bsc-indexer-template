import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEthereumAddress } from 'class-validator';

@InputType('PartDtoInput')
@ObjectType('PartDto')
export class PartDto {
  @IsEthereumAddress()
  @Field(() => String)
  @Transform(({ value }) => value.toLowerCase())
  account: string;

  @Field(() => Int)
  value: number;
}
