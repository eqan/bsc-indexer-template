import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNumber } from 'class-validator';

@ObjectType()
@InputType('ERC721AssetDto')
export class ERC721AssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;

  @IsNumber()
  @Field()
  tokenId: number;
}
