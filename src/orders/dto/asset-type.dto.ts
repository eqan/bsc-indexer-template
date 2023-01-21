import { Module, Injectable } from '@nestjs/common';
import { Binary } from 'typeorm';
import { IsEnum } from 'class-validator';
import { keccak256 } from '@ethersproject/keccak256';

@Injectable()
export class AssetType {
  type: Type;

  data: Buffer;

  nft: boolean;

  toLegacy(): any {
    return null;
  }

  forPeople(): [Type, Buffer] {
    return [this.type, this.data];
  }

  // forTx(): [Buffer, Buffer] {
  //     return [this.type.id.toBuffer(), this.data];
  // }

  get isLazy(): boolean {
    return this.type === Type.ERC1155_LAZY || this.type === Type.ERC721_LAZY;
  }

  // static hash(type: AssetType): string {
    // implementation of keccak256 function
    // return keccak256(
    //   Buffer.concat([
    //     Buffer.from('AssetType(bytes4 assetClass,bytes data)', 'utf8'),
    //     type.type.id.toBuffer(),
    //     keccak256(type.data),
    //   ]),
    // );
  }
}

export enum Type {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC721_LAZY = 'ERC721_LAZY',
  ERC1155 = 'ERC1155',
  ERC1155_LAZY = 'ERC1155_LAZY',
  CRYPTO_PUNKS = 'CRYPTO_PUNKS',
  GEN_ART = 'GEN_ART',
  COLLECTION = 'COLLECTION',
  AMM_NFT = 'AMM_NFT',
}

@Module({
  providers: [AssetType],
  exports: [AssetType],
})
export class AssetModule {}
