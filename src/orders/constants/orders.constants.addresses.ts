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
  [Network.EthereumRinkeby]: '0xd4a57a3bd3657d0d46b4c5bac12b3f156b9b886b',
  [Network.EthereumGoerli]: '0x02afbD43cAD367fcB71305a2dfB9A3928218f0c1',
};
