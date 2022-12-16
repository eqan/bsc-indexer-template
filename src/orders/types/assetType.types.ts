export declare type AssetTypeTypes =
  | EthAssetType
  | Erc20AssetType
  | Erc721AssetType
  | Erc1155AssetType;

export type Erc20AssetType = {
  assetClass: 'ERC20';
  contract: string;
};
export declare type Erc721AssetType = {
  assetClass: 'ERC721';
  contract: string;
  tokenId: number;
};
export declare type Erc1155AssetType = {
  assetClass: 'ERC1155';
  contract: string;
  tokenId: number;
};

export declare type EthAssetType = {
  assetClass: 'ETH';
};
