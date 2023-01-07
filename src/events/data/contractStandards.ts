import { CollectionType } from 'src/graphqlFile';

export interface Standard {
  id: CollectionType;
  interfaceId: string;
  functionSignatures: string[];
}

export const TokenStandards: { [key: string]: Standard } = {
  BEP721: {
    id: CollectionType.BEP721,
    interfaceId: '0x80ac58cd',
    functionSignatures: [
      'balanceOf(address)',
      'ownerOf(uint256)',
      'approve(address,uint256)',
      'getApproved(uint256)',
      'setApprovalForAll(address,bool)',
      'isApprovedForAll(address,address)',
      'transferFrom(address,address,uint256)',
      'safeTransferFrom(address,address,uint256)',
      'safeTransferFrom(address,address,uint256,bytes)',
    ],
  },
  BEP1155: {
    id: CollectionType.BEP1155,
    interfaceId: '0xd9b67a26',
    functionSignatures: [
      'balanceOf(address,uint256)',
      'balanceOfBatch(address[],uint256[])',
      'setApprovalForAll(address,bool)',
      'isApprovedForAll(address,address)',
      'safeTransferFrom(address,address,uint256,uint256,bytes)',
      'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)',
    ],
  },
};
