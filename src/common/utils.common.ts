import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { EventDataKind } from 'src/events/data';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import { AddressZero } from '@ethersproject/constants';

export const fromBuffer = (buffer: Buffer) => '0x' + buffer.toString('hex');

export const toBuffer = (hexValue: string) =>
  Buffer.from(hexValue.slice(2), 'hex');

// --- Regex ---

export const regex = {
  url: /(\b(https|http?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|/*])/,
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
  if (kind !== 'erc721-transfer') {
    types.collectionType = CollectionType.BEP1155;
    types.type = TokenType.BEP1155;
  }
  return types;
};

export const ipfsDomain = 'https://ipfs.io/ipfs/';

//queue names
export const realtimeQueue = 'realtime-sync-events';
export const fetchCollectionQueue = 'fetch-collections';

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
