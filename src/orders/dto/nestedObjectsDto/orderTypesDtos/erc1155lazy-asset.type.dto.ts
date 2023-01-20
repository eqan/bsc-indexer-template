import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsNumber, IsString } from 'class-validator';
import { Part } from 'src/orders/types/data.types';
import { Binary } from 'typeorm';

@ObjectType()
@InputType('ERC1155LazyAssetDto')
export class ERC1155LazyAssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;

  @IsNumber()
  @Field()
  tokenId: number;

  @IsString()
  @Field()
  uri: number;

  @IsNumber()
  @Field()
  supply: number;

  @Type(() => Part)
  @Field(() => [Part])
  creators: Part[];

  @Type(() => Part)
  @Field(() => [Part])
  royalties: Part[];

  @Type(() => Binary)
  @Field(() => [Binary])
  signatures: Binary[];
}
