import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@ObjectType()
@InputType('ERC20AssetDto')
export class ERC20AssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;
}
