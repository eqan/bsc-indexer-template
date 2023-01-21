import {
  LazyErc1155Input,
  LazyErc721Input,
} from 'src/tokens/dto/lazy-token-dto';
import { CollectionAssetDto } from './orderTypesDtos/collection-asset.type.dto';
import { ERC1155AssetDto } from './orderTypesDtos/erc1155-asset.type.dto';
import { ERC20AssetDto } from './orderTypesDtos/erc20-asset.type.dto';
import { ERC721AssetDto } from './orderTypesDtos/erc721-asset.type.dto';
import { EthAssetDto } from './orderTypesDtos/eth-asset.type.dto';
import { GenerativeArtAssetType } from './orderTypesDtos/generativeart-asset.type.dto';
import { Injectable, Module } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class Data {
  assetType:
    | CollectionAssetDto
    | ERC1155AssetDto
    | ERC20AssetDto
    | ERC721AssetDto
    | EthAssetDto
    | GenerativeArtAssetType
    | LazyErc1155Input
    | LazyErc721Input;
}

@Module({
  providers: [
    CollectionAssetDto,
    ERC1155AssetDto,
    ERC20AssetDto,
    ERC721AssetDto,
    EthAssetDto,
    GenerativeArtAssetType,
    LazyErc1155Input,
    LazyErc721Input,
  ],
  exports: [
    CollectionAssetDto,
    ERC1155AssetDto,
    ERC20AssetDto,
    ERC721AssetDto,
    EthAssetDto,
    GenerativeArtAssetType,
    LazyErc1155Input,
    LazyErc721Input,
  ],
})
export class DataModule {}

export function convertDataToJson(dataJson: JSON) {
  return plainToClass(Data, dataJson);
}
