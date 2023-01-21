export class FeatureFlags {
  constructor(
    public showAllOrdersByDefault: boolean = false,
    public showLooksrareOrdersWithOtherPlatforms: boolean = false,
    public showSudoSwapOrdersWithOtherPlatforms: boolean = false,
    public skipGetTrace: boolean = false,
    public checkOnChainApprove: boolean = false,
    public applyOnChainApprove: boolean = false,
    public searchSudoSwapErc1155Transfer: boolean = false,
    public checkMinimalBidPrice: boolean = false,
    public checkMinimalCollectionBidPriceOnly: boolean = false,
    public enableAuction: boolean = false,
    public skipEventsIfNoTraceFound: boolean = false,
    public getPoolInfoFromChain: boolean = true,
    public sudoswapEnabled: boolean = true,
  ) {}
}
