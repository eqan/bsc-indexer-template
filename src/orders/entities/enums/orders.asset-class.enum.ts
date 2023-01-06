import { registerEnumType } from '@nestjs/graphql';

export enum AssetClassEnum {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  COLLECTION = 'COLLECTION',
  ERC721_LAZY = 'ERC721_LAZY',
  ERC1155_LAZY = 'ERC1155_LAZY',
}

registerEnumType(AssetClassEnum, {
  name: 'AssetClassEnum',
});
