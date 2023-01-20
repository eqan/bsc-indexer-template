import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import {
  LazyErc1155Input,
  LazyErc721Input,
} from 'src/tokens/dto/lazy-token-dto';
import { CollectionAssetType } from './orderTypesDtos/collection-asset.type.dto';
import { ERC1155AssetDto } from './orderTypesDtos/erc1155-asset.type.dto';
import { ERC1155LazyAssetDto } from './orderTypesDtos/erc1155lazy-asset.type.dto';
import { ERC20AssetDto } from './orderTypesDtos/erc20-asset.type.dto';
import { ERC721AssetDto } from './orderTypesDtos/erc721-asset.type.dto';
import { ERC721LazyAssetDto } from './orderTypesDtos/erc721lazy-asset.type.dto';
import { EthAssetDto } from './orderTypesDtos/eth-asset.type.dto';
import { GenerativeArtAssetType } from './orderTypesDtos/generativeart-asset.type.dto';

@ObjectType()
@InputType('DataDto')
export class Data {
  @IsOptional()
  @Field({ nullable: true })
  collection?: CollectionAssetType;

  @IsOptional()
  @Field({ nullable: true })
  erc20?: ERC20AssetDto;

  @IsOptional()
  @Field({ nullable: true })
  erc721?: ERC721AssetDto;

  @IsOptional()
  @Field({ nullable: true })
  erc1155?: ERC1155AssetDto;

  @IsOptional()
  @Field({ nullable: true })
  erc721Lazy?: LazyErc721Input;

  @IsOptional()
  @Field({ nullable: true })
  erc1155Lazy?: LazyErc1155Input;

  @IsOptional()
  @Field({ nullable: true })
  eth?: EthAssetDto;

  @IsOptional()
  @Field({ nullable: true })
  generativeArt?: GenerativeArtAssetType;
}
