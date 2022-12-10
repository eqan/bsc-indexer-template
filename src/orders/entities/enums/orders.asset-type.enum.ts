import { registerEnumType } from '@nestjs/graphql';

export enum AssetTypeEnum {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

registerEnumType(AssetTypeEnum, {
  name: 'AssetTypeEnum',
});
