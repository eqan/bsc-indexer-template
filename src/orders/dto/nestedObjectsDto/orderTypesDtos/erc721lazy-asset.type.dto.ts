import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEthereumAddress, IsNumber, IsString } from 'class-validator';
import { Part } from 'src/orders/types/data.types';
import { Binary } from 'typeorm';

@ObjectType()
@InputType('ERC721LazyAssetDto')
export class ERC721LazyAssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;

  @IsNumber()
  @Field()
  tokenId: number;

  @IsString()
  @Field()
  uri: number;

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
