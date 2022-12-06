import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export const AssetTypeUnion = createUnionType({
  name: 'AssetType',
  types: () =>
    [EthAssetType, Erc20AssetType, Erc721AssetType, Erc1155AssetType] as const,
});

// export const ResultUnion = createUnionType({
//   name: 'ResultUnion',
//   types: () => [Author, Book] as const,
// });

@ObjectType('Asset')
@InputType('AssetInput')
export class Asset {
  @IsString()
  @Field()
  value: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  valueDecimal?: string;

  @ValidateNested()
  // @Type(() => EthAssetType| Erc20AssetType
  // | Erc721AssetType
  // | Erc1155AssetType;)
  // @Field(() => Array<typeof AssetTypeUnion>)
  assetType: EthAssetType | Erc20AssetType | Erc721AssetType | Erc1155AssetType;
}

// export AssetType =
//   | EthAssetType
//   | Erc20AssetType
//   | Erc721AssetType
//   | Erc1155AssetType;
// | Erc721LazyAssetType
// | Erc1155LazyAssetType
// | CryptoPunksAssetType
// | CollectionAssetType
// | AmmNftAssetType
// | GenerativeArtAssetType;

type ETH = "'ETH'";

@ObjectType('EthAssetType')
@InputType('EthAssetInput')
export class EthAssetType {
  @Field()
  assetClass: ETH;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;
}

// export declare type EthAssetType = {
//   assetClass: 'ETH';
// };
@ObjectType('Erc20AssetType')
@InputType('Erc20AssetInput')
export class Erc20AssetType {
  @Field()
  assetClass: 'ERC20';

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;
}

@ObjectType('Erc721AssetType')
@InputType('Erc21AssetInput')
export class Erc721AssetType {
  @Field()
  assetClass: 'ERC721';

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsNotEmpty()
  @Field()
  tokenId: number;
}
@ObjectType('Erc1155AssetType')
@InputType('Erc1155AssetInput')
export class Erc1155AssetType {
  @Field()
  assetClass: 'ERC1155';

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsNotEmpty()
  @Field()
  tokenId: number;
}

// export const Erc20AssetType = {
//   assetClass: 'ERC20';
//   contract: Address;
// };
// export declare type Erc721AssetType = {
//   assetClass: 'ERC721';
//   contract: Address;
//   tokenId: BigNumber;
// };
// export declare type Erc1155AssetType = {
//   assetClass: 'ERC1155';
//   contract: Address;
//   tokenId: BigNumber;
// };

// export declare type Erc721LazyAssetType = {
//   assetClass: 'ERC721_LAZY';
//   contract: Address;
//   tokenId: BigNumber;
//   uri: string;
//   creators: Array<Part>;
//   royalties: Array<Part>;
//   signatures: Array<Binary>;
// };
// export declare type Erc1155LazyAssetType = {
//   assetClass: 'ERC1155_LAZY';
//   contract: Address;
//   tokenId: BigNumber;
//   uri: string;
//   supply: BigNumber;
//   creators: Array<Part>;
//   royalties: Array<Part>;
//   signatures: Array<Binary>;
// };

// export declare type Erc1155LazyAssetType = {
//   assetClass: 'ERC1155_LAZY';
//   contract: Address;
//   tokenId: BigNumber;
//   uri: string;
//   supply: BigNumber;
//   creators: Array<Part>;
//   royalties: Array<Part>;
//   signatures: Array<Binary>;
// };
// export declare type CryptoPunksAssetType = {
//   assetClass: 'CRYPTO_PUNKS';
//   contract: Address;
//   tokenId: number;
// };
// export declare type CollectionAssetType = {
//   assetClass: 'COLLECTION';
//   contract: Address;
// };
// export declare type AmmNftAssetType = {
//   assetClass: 'AMM_NFT';
//   contract: Address;
// };
// export declare type GenerativeArtAssetType = {
//   assetClass: 'GEN_ART';
//   contract: Address;
// };
