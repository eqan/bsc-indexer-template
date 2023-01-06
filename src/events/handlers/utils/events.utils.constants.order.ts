export type ChainIdToAddressMap = {
  [chainId: number]: { [address: string]: string };
};

//TODO:NEED TO INCLUDE OUR MARKETPLACE ROUTER CONTRACT
export const Routers: ChainIdToAddressMap = {
  // Network.Ethereum
  1: {
    // Rarible
    '0x9757f2d2b135150bbeb65308d4a91804107cd8d6': 'rarible.com',
    '0x2a7251d1e7d708c507b1b0d3ff328007beecce5d': 'rarible.com',
    '0x7f19564c35c681099c0c857a7141836cf7edaa53': 'rarible.com',
    // Reservoir (modules)
    '0x920692834f93258b71221c58edf870ae013e2f9b': 'reservoir.tools',
    '0xef21d6b43ac0bb4608ca05628b05403a47310a3b': 'reservoir.tools',
    '0xff78f7c6e23187fd4bdb2f7f35359a42d56878dd': 'reservoir.tools',
    '0x5c8a351d4ff680203e05af56cb9d748898c7b39a': 'reservoir.tools',
    '0x385df8cbc196f5f780367f3cdc96af072a916f7e': 'reservoir.tools',
    '0x3729014ef28f01b3ddcf7f980d925e0b71b1f847': 'reservoir.tools',
    '0xecd3184bc21172ea96061afeefaa136e5b3761b6': 'reservoir.tools',
    '0x613d3c588f6b8f89302b463f8f19f7241b2857e2': 'reservoir.tools',
    '0x8162beec776442afd262b672730bb5d0d8af16a1': 'reservoir.tools',
    '0x982b49de82a3ea5b8c42895482d9dd9bfefadf82': 'reservoir.tools',
    '0xb1096516fc33bb64a77158b10f155846e74bd7fa': 'reservoir.tools',
  },
  //   Network.EthereumGoerli
  5: {
    // Reservoir (routers)
    '0xf44caa746d184e6fba3071e8adbf9c041620fe44': 'reservoir.tools',
    '0xb35d22a4553ab9d2b85e2a606cbae55f844df50c': 'reservoir.tools',
    // Reservoir (modules)
    '0xe4c1c635f257348205ebca78fc9b342dd7813e2b': 'reservoir.tools',
    '0x037d39e603b803651acc7b36ff25e52f8680aa2f': 'reservoir.tools',
    '0x0e01862920bd5ef73ed1a5dccd2ecad56c3e051f': 'reservoir.tools',
    '0x532486bb46581b032134159c1d31962cdab1e6a7': 'reservoir.tools',
    '0x6c460f133c573c21e7f55900d0c68f6f085b91e7': 'reservoir.tools',
    '0x6a789513b2e555f9d3539bf9a053a57d2bfca426': 'reservoir.tools',
    '0x29fcac61d9b2a3c55f3e1149d0278126c31abe74': 'reservoir.tools',
  },
};

//TODO: NEED TO CHANGE THE TYPES TO BNB
export const ERC20 = '0x8ae85d84';
export const ETH = '0xaaaebeba';
export const ERC721 = '0x73ad2146';
export const ERC1155 = '0x973bb640';
export const COLLECTION = '0xf63c2825';

export const matchOrdersSigHash = '0xe99a3f80';
export const directPurchaseSigHash = '0x0d5f7d35';
export const directAcceptBidSigHash = '0x67d49a3b';

export const assetTypes = [ERC721, ERC1155, ERC20, ETH, COLLECTION];
