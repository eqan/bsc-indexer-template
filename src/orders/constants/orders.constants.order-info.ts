import { AssetClassEnum } from '../entities/enums/orders.asset-class.enum';

export const getOrderSide = (
  makeAssetClass: string,
  takeAssetClass: string,
) => {
  //TODO: Can be rewriten to be more readable
  if (
    (makeAssetClass === AssetClassEnum.ERC721 ||
      makeAssetClass === AssetClassEnum.COLLECTION ||
      makeAssetClass === AssetClassEnum.ERC721_LAZY ||
      makeAssetClass === AssetClassEnum.ERC1155 ||
      makeAssetClass === AssetClassEnum.ERC1155_LAZY) &&
    (takeAssetClass === AssetClassEnum.ERC20 ||
      takeAssetClass === AssetClassEnum.ETH ||
      takeAssetClass === AssetClassEnum.COLLECTION)
  ) {
    return 'sell';
  } else if (
    (makeAssetClass === AssetClassEnum.ERC20 ||
      makeAssetClass === AssetClassEnum.ETH) &&
    (takeAssetClass === AssetClassEnum.ERC721 ||
      takeAssetClass === AssetClassEnum.ERC721_LAZY ||
      takeAssetClass === AssetClassEnum.ERC1155 ||
      takeAssetClass === AssetClassEnum.ERC1155_LAZY ||
      takeAssetClass === AssetClassEnum.COLLECTION)
  ) {
    return 'buy';
  } else {
    throw new Error('Invalid asset class');
  }
};
