import { Interface } from '@ethersproject/abi';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { BadRequestException } from '@nestjs/common';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { getNetworkSettings } from 'src/config/network.config';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
export const fromBuffer = (buffer: Buffer) => '0x' + buffer.toString('hex');

export const toBuffer = (hexValue: string) =>
  Buffer.from(hexValue.slice(2), 'hex');

// --- Regex ---
export const regex = {
  url: /(\b(https|http?|ftp|file|ipfs):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|/*])/,
  query: /(\{[a-z]*id\})/g,
  ipfs: /(^(ipfs:|ipns:)\/\/*)/,
  base64: /^data:image\/[a-z]*(\+[a-z]*|);base64/g,
  itemId: /^.{42}:\d*\S$/,
};

// ---- returns true if url is base64 encoded
export const isBase64Encoded = (tokenURI: string) =>
  tokenURI?.split(',')[0] === 'data:application/json;base64' ? true : false;

// parses base64 to json
export const base64toJson = (tokenURI: string) =>
  JSON.parse(Buffer.from(tokenURI?.split(',')[1], 'base64').toString('utf8'));

export const getTokenType = (collectionType: CollectionType): TokenType => {
  const tokenType =
    collectionType === CollectionType.BEP721
      ? TokenType.BEP721
      : TokenType.BEP1155;
  return tokenType;
};

// BigNumbers
export const bigNumber = (value: BigNumberish) => BigNumber.from(value);

//ipfs gateway for fast retrival of metadata
export const ipfsGateway = 'https://ipfs.io/ipfs/';

//Contract Interfaces
export const CollectionIface = new Interface([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function owner() public view returns (address)',
  'function supportsInterface(bytes4 interfaceId) public view returns (bool)',
  'function contractURI() public view returns(string)',
]);

export const TokenIface = new Interface([
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function uri(uint256 _id) external view returns (string memory)',
  'function ownerOf(uint256 _tokenId) external view returns (address)',
]);

export const CurrencyIface = new Interface([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]);

export const SafeTransferFromERC721Iface = new Interface([
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
]);

export const SafeTransferFromERC1155Iface = new Interface([
  'function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)',
]);

export const IERC721LazyMint = new Interface([
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'creators',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'royalties',
            type: 'tuple[]',
          },
          {
            internalType: 'bytes[]',
            name: 'signatures',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct LibERC721LazyMint.Mint721Data',
        name: 'data',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mintAndTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]);

export const IERC1155LazyMint = new Interface([
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'tokenURI',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'supply',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'creators',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'royalties',
            type: 'tuple[]',
          },
          {
            internalType: 'bytes[]',
            name: 'signatures',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct LibERC1155LazyMint.Mint1155Data',
        name: 'data',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'mintAndTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
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

export const getContractURI = async (
  contract: Contract,
): Promise<string | null> => {
  try {
    return await contract.contractURI();
  } catch (error) {
    return null;
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

// --- Misc ---
export const lowerCase = (value: string) => value.toLowerCase();

//check if itemId pattern is correct
export const checkItemIdForamt = (
  itemId: string,
): [contract: string, tokenId: string] => {
  if (itemId.match(regex.itemId)) {
    const [contract, tokenId] = itemId.split(':');
    return [contract, tokenId];
  } else
    throw new BadRequestException(
      'ItemId must match format ${token}:${tokenId}',
    );
};

//converts array items to lowercase
export const arrayItemsToLowerCase = (items: string[]): string[] =>
  items.map((item) => item.toLowerCase());

//checks if the input enum is valid or not
export const isEnumValid = <T>(value: string, _enum: T) =>
  Object.values(_enum)?.includes(value);

export function removeLeadingSlashes(str: string): string {
  let result = str;
  while (result.startsWith('/')) {
    result = result.replace(/^\/+/, '');
  }
  return result;
}

export function isCID(hash: string): boolean {
  return true;
}
