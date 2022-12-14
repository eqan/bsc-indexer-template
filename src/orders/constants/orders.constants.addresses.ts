type ChainIdToAddress = { [chainId: number]: string };
enum Network {
  // Ethereum
  Ethereum = 1,
  EthereumRinkeby = 4,
  EthereumGoerli = 5,
  EthereumKovan = 42,
  // Optimism
  Optimism = 10,
  OptimismKovan = 69,
  // Gnosis
  Gnosis = 100,
  //Binance
  Binance = 56,
  //BinanceTestnet
  BinanceTestnet = 97,
}
export const Exchange: ChainIdToAddress = {
  [Network.Ethereum]: '0x9757f2d2b135150bbeb65308d4a91804107cd8d6',
  [Network.EthereumGoerli]: '0x02afbd43cad367fcb71305a2dfb9a3928218f0c1',
};
