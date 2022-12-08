import { createUnionType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AssetTypeEnum } from './enums/orders.assetType.enum';

@ObjectType('BaseAssetType')
@InputType('BaseAssetTypeInput')
class BaseAssetType {
  // $assetClass: string;
  @IsEnum(AssetTypeEnum)
  @Field(() => AssetTypeEnum)
  assetClass: AssetTypeEnum;
}

@ObjectType('EthAssetType')
@InputType('EthAssetInput')
export class EthAssetType extends BaseAssetType {
  // @IsEnum(AssetTypeEnum)
  // @Field(() => AssetTypeEnum)
  // assetClass: AssetTypeEnum;

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
export class Erc20AssetType extends BaseAssetType {
  // @IsEnum(AssetTypeEnum)
  // @Field(() => AssetTypeEnum)
  // assetClass: AssetTypeEnum;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;
}

@ObjectType('Erc721AssetType')
@InputType('Erc21AssetInput')
export class Erc721AssetType extends BaseAssetType {
  // @IsEnum(AssetTypeEnum)
  // @Field(() => AssetTypeEnum)
  // assetClass: AssetTypeEnum;

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
export class Erc1155AssetType extends BaseAssetType {
  // @IsEnum(AssetTypeEnum)
  // @Field(() => AssetTypeEnum)
  // assetClass: AssetTypeEnum;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;

  @IsNotEmpty()
  @Field()
  tokenId: number;
}

type AssetTypes =
  | EthAssetType
  | Erc20AssetType
  | Erc721AssetType
  | Erc1155AssetType;

export const AssetTypeUnion = createUnionType({
  name: 'AssetTypes',
  types: () =>
    [EthAssetType, Erc20AssetType, Erc721AssetType, Erc1155AssetType] as const,
  resolveType(value) {
    switch (value.assetClass) {
      case AssetTypeEnum.ETH:
        return EthAssetType;
      case AssetTypeEnum.ERC20:
        return Erc20AssetType;
      case AssetTypeEnum.ERC721:
        return Erc721AssetType;
      case AssetTypeEnum.ERC1155:
        return Erc1155AssetType;
      default:
        return null;

      // if (value.assetClass === 'ETH') {
      //   return EthAssetType;
      // }
      // if (value.assetClass === 'ERC20') {
      //   return Erc20AssetType;
      // }
      // if (value.assetClass === 'ERC721') {
      //   return Erc721AssetType;
      // }
      // if (value.assetClass === 'ERC71155') {
      //   return Erc1155AssetType;
      // }
      // return null;
    }
  },
});

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
  // @Type(() => AssetTypeUnion)
  @Type(() => BaseAssetType, {
    discriminator: {
      property: '__type',
      subTypes: [
        { value: EthAssetType, name: 'EthAssetType' },
        { value: Erc20AssetType, name: 'Erc20AssetType' },
        { value: Erc721AssetType, name: 'Erc721AssetType' },
        { value: Erc721AssetType, name: 'Erc721AssetType' },
      ],
    },
  })
  // @Field(() => AssetTypeUnion)
  assetType: AssetTypes;
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
