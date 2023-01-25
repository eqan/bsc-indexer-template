import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Address, BigNumber, Binary } from '@rarible/types';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import { CustomAddressScalar } from 'src/core/customScalars/address';
import { CustomBigNumberScalar } from 'src/core/customScalars/bignumber';
import { CustomBinaryScalar } from 'src/core/customScalars/binary';
import { PartDto } from 'src/core/dto/part.dto';

import {
  assetTypeValidationSchema,
  validate,
} from 'src/orders/constants/orders.constants.validation-schema';
import { CustomDataScalar } from './data.scalar.dto';

export const CustomAssetScalar = new GraphQLScalarType({
  name: 'ASSET_SCALAR',
  description: 'A simple Asset Parser',
  serialize: (value) => validate(value, assetTypeValidationSchema),
  parseValue: (value) => validate(value, assetTypeValidationSchema),
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
  @Field(() => CustomDataScalar)
  assetType: AssetType;
}
export enum AssetTypeEnum {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  ERC721_LAZY = 'ERC721_LAZY',
  ERC1155_LAZY = 'ERC1155_LAZY',
  COLLECTION = 'COLLECTION',
}
registerEnumType(AssetTypeEnum, {
  name: 'AssetTypeEnum',
  description: 'AssetType Enum',
});

@ObjectType('EthAssetType')
@InputType('EthAssetType')
export class EthAssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ETH })
  @Type(() => () => AssetTypeEnum.ETH)
  readonly assetClass: AssetTypeEnum.ETH;
}

@ObjectType('Erc20AssetType')
@InputType('Erc20AssetType')
export class Erc20AssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ERC20 })
  @Type(() => () => AssetTypeEnum.ERC20)
  readonly assetClass: AssetTypeEnum.ERC20;
  @Field(() => CustomAddressScalar)
  contract: Address;
}
@ObjectType('CollectionAssetType')
@InputType('CollectionAssetType')
export class CollectionAssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.COLLECTION })
  @Type(() => () => AssetTypeEnum.COLLECTION)
  readonly assetClass: AssetTypeEnum.COLLECTION;
  @Field(() => CustomAddressScalar)
  contract: Address;
}
@ObjectType('Erc721AssetType')
@InputType('Erc721AssetType')
export class Erc721AssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ERC721 })
  @Type(() => () => AssetTypeEnum.ERC721)
  readonly assetClass: AssetTypeEnum.ERC721;
  @Field(() => CustomAddressScalar)
  contract: Address;
  @Field(() => CustomBigNumberScalar)
  tokenId: BigNumber;
}
@ObjectType('Erc1155AssetType')
@InputType('Erc1155AssetType')
export class Erc1155AssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ERC1155 })
  @Type(() => () => AssetTypeEnum.ERC1155)
  readonly assetClass: AssetTypeEnum.ERC1155;
  @Field(() => CustomAddressScalar)
  contract: Address;
  @Field(() => CustomBigNumberScalar)
  tokenId: BigNumber;
}
@ObjectType('Erc721LazyAssetType')
@InputType('Erc721LazyAssetType')
export class Erc721LazyAssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ERC721_LAZY })
  @Type(() => () => AssetTypeEnum.ERC721_LAZY)
  readonly assetClass: AssetTypeEnum.ERC721_LAZY;
  @Field(() => CustomAddressScalar)
  contract: Address;
  @Field(() => CustomBigNumberScalar)
  tokenId: BigNumber;
  @Field(() => String)
  uri: string;
  @Field(() => [PartDto])
  creators: PartDto[];
  @Field(() => [PartDto])
  royalties: PartDto[];
  @Field(() => [CustomBinaryScalar])
  signatures: Binary[];
}
@ObjectType('Erc1155LazyAssetType')
@InputType('Erc1155LazyAssetType')
export class Erc1155LazyAssetType {
  @Field(() => AssetTypeEnum, { defaultValue: AssetTypeEnum.ERC1155_LAZY })
  @Type(() => () => AssetTypeEnum.ERC1155_LAZY)
  readonly assetClass: AssetTypeEnum.ERC1155_LAZY;
  @Field(() => CustomAddressScalar)
  contract: Address;
  @Field(() => CustomBigNumberScalar)
  tokenId: BigNumber;
  @Field(() => String)
  uri: string;
  @Field(() => CustomBigNumberScalar)
  supply: BigNumber;
  @Field(() => [PartDto])
  creators: PartDto[];
  @Field(() => [PartDto])
  royalties: PartDto[];
  @Field(() => [CustomBinaryScalar])
  signatures: Binary[];
}

export type AssetType =
  | EthAssetType
  | Erc20AssetType
  | Erc721AssetType
  | Erc1155AssetType
  | Erc721LazyAssetType
  | Erc1155LazyAssetType
  | CollectionAssetType;

@InputType('AssetTypeInput')
export class AssetTypeInput {
  @Field(() => AssetTypeEnum)
  type: AssetTypeEnum;

  @Field(() => AssetTypeEnum)
  assetClass: AssetTypeEnum;

  @Field(() => CustomAddressScalar, { nullable: true })
  contract?: Address;

  @Field(() => CustomBigNumberScalar, { nullable: true })
  tokenId?: BigNumber;

  @Field(() => String, { nullable: true })
  uri?: string;

  @Field(() => CustomBigNumberScalar, { nullable: true })
  supply?: BigNumber;

  @Field(() => [PartDto], { nullable: true })
  creators?: PartDto[];

  @Field(() => [PartDto], { nullable: true })
  royalties?: PartDto;

  @Field(() => [CustomBinaryScalar], { nullable: true })
  signatures?: Binary[];
}

@ObjectType('OrderFormAsset')
@InputType('OrderFormAsset')
export class OrderFormAsset {
  @Field(() => AssetTypeInput)
  // @Transform(({ value }: { value: AssetTypeInput }): AssetType => {
  //   switch (value.assetClass) {
  //     case AssetTypeEnum.ETH: {
  //       return {
  //         assetClass: value.assetClass,
  //       };
  //     }
  //     case AssetTypeEnum.ERC20: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //       };
  //     }
  //     case AssetTypeEnum.ERC721: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //         tokenId: value.tokenId,
  //       };
  //     }
  //     case AssetTypeEnum.ERC1155: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //         tokenId: value.tokenId,
  //       };
  //     }
  //     case AssetTypeEnum.ERC721_LAZY: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //         tokenId: value.tokenId,
  //         uri: value.uri,
  //         creators: value.creators,
  //         royalties: value.royalties,
  //         signatures: value.signatures,
  //       };
  //     }
  //     case AssetTypeEnum.ERC1155_LAZY: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //         tokenId: value.tokenId,
  //         supply: value.supply,
  //         uri: value.uri,
  //         creators: value.creators,
  //         royalties: value.royalties,
  //         signatures: value.signatures,
  //       };
  //     }
  //     case AssetTypeEnum.COLLECTION: {
  //       return {
  //         assetClass: value.assetClass,
  //         contract: value.contract,
  //       };
  //     }
  //   }
  // })
  @Type(() => AssetTypeInput, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: EthAssetType, name: AssetTypeEnum.ETH },
        { value: Erc20AssetType, name: AssetTypeEnum.ERC20 },
        { value: Erc721AssetType, name: AssetTypeEnum.ERC721 },
        { value: Erc1155AssetType, name: AssetTypeEnum.ERC1155 },
        { value: Erc721LazyAssetType, name: AssetTypeEnum.ERC721_LAZY },
        { value: Erc1155LazyAssetType, name: AssetTypeEnum.ERC1155_LAZY },
        { value: CollectionAssetType, name: AssetTypeEnum.COLLECTION },
      ],
    },
  })
  assetType: AssetType;

  @Field(() => CustomBigNumberScalar)
  value: BigNumber;
}
