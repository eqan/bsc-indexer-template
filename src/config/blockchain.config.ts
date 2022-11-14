export const BlockchainConfig = () => ({
  chainId: Number(process.env.CHAIN_ID),
  baseNetworkHttpUrl: String(process.env.BASE_NETWORK_HTTP_URL),
  baseNetworkWsUrl: String(process.env.BASE_NETWORK_WS_URL)
});
