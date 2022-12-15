import { Interface } from '@ethersproject/abi';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { getNetworkSettings } from 'src/config/network.config';
import { EventDataKind } from 'src/events/types/events.types';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import * as fs from 'fs';
import * as path from 'path';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export const fromBuffer = (buffer: Buffer) => '0x' + buffer.toString('hex');

export const toBuffer = (hexValue: string) =>
  Buffer.from(hexValue.slice(2), 'hex');

// --- Regex ---

export const regex = {
  url: /(\b(https|http?|ftp|file|ipfs):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|/*])/,
  query: /(\{[a-z]*id\})/g,
  ipfs: /(^(ipfs:|ipns:)\/\/*)/,
  base64: /^data:image\/[a-z]*(\+[a-z]*|);base64/g,
};

// ---- returns true if url is base64 encoded

export const isBase64Encoded = (tokenURI: string) =>
  tokenURI?.split(',')[0] === 'data:application/json;base64' ? true : false;

// parses base64 to json

export const base64toJson = (tokenURI: string) =>
  JSON.parse(Buffer.from(tokenURI?.split(',')[1], 'base64').toString('ascii'));

//Types of Collection and Token
export const getTypes = (kind: EventDataKind) => {
  const types = {
    collectionType: CollectionType.BEP721,
    type: TokenType.BEP721,
  };

  if (!kind?.startsWith('erc721')) {
    types.collectionType = CollectionType.BEP1155;
    types.type = TokenType.BEP1155;
  }
  return types;
};

// BigNumbers
export const bn = (value: BigNumberish) => BigNumber.from(value);

// export const getTypesUsingInterface = async (collectionId: string) => {
//   const types = {
//     collectionType: CollectionType.BEP721,
//     type: TokenType.BEP721,
//   };

//   const ERC1155InterfaceId = '0xd9b67a26';
//   const ERC721InterfaceId = '0x80ac58cd';
//   const ERC165Abi: any = [
//     {
//       inputs: [
//         {
//           internalType: 'bytes4',
//           name: 'interfaceId',
//           type: 'bytes4',
//         },
//       ],
//       name: 'supportsInterface',
//       outputs: [
//         {
//           internalType: 'bool',
//           name: '',
//           type: 'bool',
//         },
//       ],
//       stateMutability: 'view',
//       type: 'function',
//     },
//   ];
//   try {
//     const baseNetworkHttpUrl = process.env.BASE_NETWORK_HTTP_URL;
//     const chainId = 56 || process.env.CHAIN_ID;

//     const baseProvider = new StaticJsonRpcProvider(baseNetworkHttpUrl, chainId);

//     const contract = new Contract(collectionId, ERC165Abi, baseProvider);
//     const result = await contract.methods.supportsInterface(ERC721InterfaceId);
//     console.log(result, 'call result');
//   } catch (e) {
//     console.log(e, 'failed method');
//   }
// };

export const ipfsDomain = 'https://ipfs.io/ipfs/';

//queue names
// export const realtimeQueue = 'realtime-sync-events';
// export const REAL_TIME_CRON = 'REAL_TIME_CRON';
// export const BACKFILL_CRON = 'BACKFILL_CRON';
// export const midwayQueue = 'midway-sync-events';
// export const backfillQueue = 'backfill-sync-events';
// export const fetchCollectionQueue = 'fetch-collections';

//Contract Interfaces
export const CollectionIface = new Interface([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function owner() public view returns (address)',
]);

export const TokenIface = new Interface([
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function uri(uint256 _id) external view returns (string memory)',
  'function ownerOf(uint256 _tokenId) external view returns (address)',
]);

//contract helper methods
export const getCollectionName = async (contract: Contract) => {
  try {
    return await contract.name();
  } catch (error) {
    return '';
  }
};

export const getCollectionSymbol = async (contract: Contract) => {
  try {
    return await contract.symbol();
  } catch (error) {
    return '';
  }
};

export const getCollectionOwner = async (contract: Contract) => {
  try {
    return await contract.owner();
  } catch (error) {
    return AddressZero;
  }
};

export const getNFTCreator = async (contract: Contract, tokenId: string) => {
  try {
    return [await contract.ownerOf(tokenId)];
  } catch (error) {
    return [];
  }
};

export const getTokenURI = async (
  type: TokenType,
  tokenId: string,
  contract: Contract,
) => {
  try {
    const tokenURI =
      type === TokenType.BEP721
        ? await contract.tokenURI(tokenId)
        : await contract.uri(tokenId);
    return tokenURI;
  } catch (error) {
    return '';
  }
};

//helper functions to create chunks of blocks
export const createChunks = (blocksToProcess: number) => {
  const maxBlocks = getNetworkSettings().realtimeSyncMaxBlockLag;
  return new Array(Math.floor(blocksToProcess / maxBlocks))
    ?.fill(maxBlocks)
    ?.concat(Math.floor(blocksToProcess % maxBlocks));
};

//returns true if token got burnt
export const isDeleted = (to: string): boolean => {
  return to === AddressZero ? true : false;
};

//absolute path to pem files
const PATH_TO_PRIVATE_KEY = '/home/elitebook/bsc-indexer/rsa_4096_priv.pem';
const PATH_TO_PUBLIC_KEY = '/home/elitebook/bsc-indexer/rsa_4096_pub.pem';

export const getPublicKey = () => {
  const absolutePath = path.resolve(PATH_TO_PUBLIC_KEY);
  const publicKey = fs.readFileSync(absolutePath, 'utf8');
  return publicKey;
};

export const getPrivateKey = () => {
  const absolutePath = path.resolve(PATH_TO_PRIVATE_KEY);
  const privateKey = fs.readFileSync(absolutePath, 'utf8');
  return privateKey;
};
