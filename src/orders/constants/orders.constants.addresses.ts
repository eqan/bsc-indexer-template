import { AddressZero } from '@ethersproject/constants';
type ChainIdToAddress = { [chainId: number]: string };
enum Network {
  // Ethereum
  Ethereum = 1,
  EthereumGoerli = 5,
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

export const Eth: ChainIdToAddress = {
  [Network.Ethereum]: AddressZero,
  [Network.EthereumGoerli]: AddressZero,
  [Network.Optimism]: AddressZero,
  [Network.Gnosis]: AddressZero,
  [Network.Binance]: AddressZero,
};

export const Weth: ChainIdToAddress = {
  [Network.Ethereum]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [Network.EthereumGoerli]: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
  [Network.Optimism]: '0x4200000000000000000000000000000000000006',
  [Network.Gnosis]: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
  // Binnce: Wrapped BNB
  //TODO:NEED TO CONFIRM THESE ADDRESSES
  [Network.Binance]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [Network.BinanceTestnet]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};
