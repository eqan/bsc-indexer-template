import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNumber } from 'class-validator';

@ObjectType()
@InputType('ERC1155AssetDto')
export class ERC1155AssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;

  @IsNumber()
  @Field()
  tokenId: number;
}
