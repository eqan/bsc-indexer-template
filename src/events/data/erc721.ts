import { EventData } from './index';
import { Interface } from '@ethersproject/abi';

// There are some NFTs which do not strictly adhere to the ERC721
// standard (eg. Cryptovoxels) but it would still be good to have
// support for them. We should have custom rules for these.

export const transfer: EventData = {
  kind: 'erc721-transfer',
  topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  numTopics: 4,
  abi: new Interface([
    `event Transfer(
      address indexed from,
      address indexed to,
      uint256 indexed tokenId
    )`
  ])
};

// The `ApprovalForAll` event is the same for erc721 and erc1155
export const approvalForAll: EventData = {
  kind: 'erc721/1155-approval-for-all',
  topic: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
  numTopics: 3,
  abi: new Interface([
    `event ApprovalForAll(
      address indexed owner,
      address indexed operator,
      bool approved
    )`
  ])
};
