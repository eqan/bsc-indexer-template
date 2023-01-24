import { Currency } from 'src/orders/types/order.prices.types';

type FeatureFlags = {
  showAllOrdersByDefault: boolean;
  showLooksrareOrdersWithOtherPlatforms: boolean;
  showSudoSwapOrdersWithOtherPlatforms: boolean;
  skipGetTrace: boolean;
  checkOnChainApprove: boolean;
  applyOnChainApprove: boolean;
  searchSudoSwapErc1155Transfer: boolean;
  checkMinimalBidPrice: boolean;
  checkMinimalCollectionBidPriceOnly: boolean;
  enableAuction: boolean;
  skipEventsIfNoTraceFound: boolean;
  getPoolInfoFromChain: boolean;
  sudoswapEnabled: boolean;
};

export const getFeatureFlags = (): FeatureFlags => {
  const defaultFeatureFlags: FeatureFlags = {
    showAllOrdersByDefault: false,
    showLooksrareOrdersWithOtherPlatforms: false,
    showSudoSwapOrdersWithOtherPlatforms: false,
    skipGetTrace: false,
    checkOnChainApprove: false,
    applyOnChainApprove: false,
    searchSudoSwapErc1155Transfer: false,
    checkMinimalBidPrice: false,
    checkMinimalCollectionBidPriceOnly: false,
    enableAuction: false,
    skipEventsIfNoTraceFound: false,
    getPoolInfoFromChain: true,
    sudoswapEnabled: true,
  };
  return defaultFeatureFlags;
};
