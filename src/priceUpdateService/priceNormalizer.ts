import {
  AssetTypeEnum,
  OrderFormAsset,
} from 'src/orders/dto/nestedObjectsDto/asset.dto';

export async function normalize(
  orderFormAsset: OrderFormAsset,
): Promise<number> {
  const assetDecimals = await decimals(orderFormAsset);
  return Number(orderFormAsset.value) / 10 ** assetDecimals;
}

async function decimals(asset: OrderFormAsset): Promise<number> {
  switch (asset.assetType.assetClass) {
    case AssetTypeEnum.ETH:
      return 18;
    case AssetTypeEnum.ERC20:
      return 1;
    //     return await this.getErc20Decimals(assetType.tokenId);
    case AssetTypeEnum.ERC1155:
    case AssetTypeEnum.ERC1155_LAZY:
    case AssetTypeEnum.ERC721:
    case AssetTypeEnum.ERC721_LAZY:
    case AssetTypeEnum.COLLECTION:
      return 0;
    default:
      throw new Error('Invalid AssetType');
  }
}

// async function getErc20Decimals(token: Address): Promise<number> {
//   if (!this.erc20Cache[token]) {
//       this.erc20Cache[token] = (await this.contractService.get(token)) as Erc20Token).decimals || 0;
//   }
//   return this.erc20Cache[token];
// }
