import { AbiCoder } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collections } from 'src/collections/entities/collections.entity';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { IERC1155LazyMint, IERC721LazyMint } from 'src/common/utils.common';
import { TypedDataUtils } from 'ethers-eip712';
import { EIP712_TYPES } from 'src/orders/types/orders.types';

import {
  LazyErc1155Input,
  LazyErc721Input,
  LazyTokenInput,
} from 'src/tokens/dto/lazy-token-dto';
import { Repository } from 'typeorm';
import { recoverAddress } from '@ethersproject/transactions';

@Injectable()
export class LazyTokenValidator {
  constructor(
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
    private readonly rpcProvider: RpcProvider,
  ) {}
  async validate(lazyToken: LazyTokenInput) {
    const contract: string = lazyToken.erc721
      ? lazyToken.erc721.contract
      : lazyToken.erc1155.contract;
    const lazyTokenId: string = lazyToken.erc721
      ? lazyToken.erc721.tokenId
      : lazyToken.erc1155.tokenId;
    const creators = lazyToken.erc721
      ? lazyToken.erc721.creators
      : lazyToken.erc1155.creators;

    const collection = await this.collectionsRepo.findOneBy({ id: contract });
    if (!collection)
      throw new BadRequestException('LazyNft collection not find');

    const encoder = new AbiCoder();
    const tokenId = encoder.encode(['uint256'], [lazyTokenId]);
    const firstCreator = creators[0].account;
    if (tokenId.length < firstCreator.length) {
      throw new BadRequestException('TokenId $token has invalid hex size');
    }
    if (!tokenId.toLowerCase().includes(firstCreator.toLowerCase())) {
      throw new BadRequestException(
        'TokenId $token must start with first creator address',
      );
    }

    try {
      await this.lazySignatureValidator(lazyToken);
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Invalid Signature');
    }

    try {
      await this.checkOwner(lazyToken);
    } catch (e: any) {
      // console.log(e, 'error');
      throw new BadRequestException("It isn't allowed to lazy mint");
    }
  }

  private async checkOwner(lazyToken: LazyTokenInput) {
    if (lazyToken.erc721) {
      await this.checkOwnerERC721(lazyToken.erc721);
    } else if (lazyToken.erc1155) {
      await this.checkOwnerERC1155(lazyToken.erc1155);
    } else {
      throw new BadRequestException("Standard doesn't support yet");
    }
  }

  private async checkOwnerERC721(lazyToken: LazyErc721Input) {
    const contract = new Contract(
      lazyToken.contract,
      IERC721LazyMint,
      this.rpcProvider.baseProvider,
    );
    const creators = lazyToken.creators.map((creator) => [
      creator.account.toString(),
      creator.value.toString(),
    ]);
    const royalties = lazyToken.royalties.map((royalty) => [
      royalty.account.toString(),
      royalty.value.toString(),
    ]);
    const signatures = lazyToken.signatures.map((signature) =>
      signature.toString(),
    );
    const mintData = [
      lazyToken.tokenId.toString(),
      lazyToken.uri.toString(),
      creators,
      royalties,
      signatures,
    ];
    await contract.estimateGas.mintAndTransfer(
      mintData,
      lazyToken.creators[0]?.account,
      { from: lazyToken.creators[0]?.account },
    );
  }

  private async checkOwnerERC1155(lazyToken: LazyErc1155Input) {
    const contract = new Contract(
      lazyToken.contract,
      IERC1155LazyMint,
      this.rpcProvider.baseProvider,
    );
    const creators = lazyToken.creators.map((creator) => [
      creator.account.toString(),
      creator.value.toString(),
    ]);
    const royalties = lazyToken.royalties.map((royalty) => [
      royalty.account.toString(),
      royalty.value.toString(),
    ]);
    const signatures = lazyToken.signatures.map((signature) =>
      signature.toString(),
    );
    const mintData = [
      lazyToken.tokenId.toString(),
      lazyToken.uri.toString(),
      lazyToken.supply.toString(),
      creators,
      royalties,
      signatures,
    ];

    await contract.estimateGas.mintAndTransfer(
      mintData,
      lazyToken.creators[0]?.account,
      lazyToken.supply.toString(),
      { from: lazyToken.creators[0]?.account },
    );
  }

  private async lazySignatureValidator(lazyToken: LazyTokenInput) {
    const creators = lazyToken.erc721
      ? lazyToken.erc721.creators
      : lazyToken.erc1155.creators;
    const signatures = lazyToken.erc721
      ? lazyToken.erc721.signatures
      : lazyToken.erc1155.signatures;

    if (creators.length !== signatures.length) {
      throw new BadRequestException('Invalid creators and signatures size');
    }
    if (new Set(creators).size !== creators.length) {
      throw new BadRequestException('All Creators must me unique');
    }
    const hash = this.hashToSign(lazyToken);
    const results = creators.map((creator, i) => {
      const signature = signatures[i];
      const recoveredAddress = recoverAddress(hash, signature);
      console.log(recoveredAddress, creator.account);
      return (
        recoveredAddress.toString().toLowerCase() ===
        creator.account.toLowerCase()
      );
    });
    console.log(hash, results, 'result');
    if (results.some((result) => !result)) {
      throw new BadRequestException('Invalid Signatures');
    }
  }

  private hashToSign(lazyToken: LazyTokenInput): Uint8Array {
    if (lazyToken.erc721) {
      return this.hashERC721(lazyToken.erc721);
    } else if (lazyToken.erc1155) {
      return this.hashERC1155(lazyToken.erc1155);
    } else {
      throw new BadRequestException('Invalid token type');
    }
  }

  private hash(
    domainData: object,
    primaryType: string,
    message: object,
    types: object,
  ): Uint8Array {
    const typedData = {
      types: Object.assign(
        {
          EIP712Domain: EIP712_TYPES.EIP712Domain,
        },
        types,
      ),
      domain: domainData,
      primaryType: primaryType,
      message: message,
    };
    const digest = TypedDataUtils.encodeDigest(typedData);
    return digest;
  }

  private hashERC721(lazyERC721Token: LazyErc721Input): Uint8Array {
    const hash = this.hash(
      {
        name: 'Mint721',
        version: '1',
        chainId: this.rpcProvider.chainId,
        verifyingContract: lazyERC721Token.contract,
      },
      'Mint721',
      {
        tokenId: lazyERC721Token.tokenId.toString(),
        tokenURI: lazyERC721Token.uri.toString(),
        creators: lazyERC721Token.creators,
        royalties: lazyERC721Token.royalties,
      },
      { Part: EIP712_TYPES.Part, Mint721: EIP712_TYPES.Mint721 },
    );
    return hash;
  }
  private hashERC1155(lazyERC1155Token: LazyErc1155Input): Uint8Array {
    const hash = this.hash(
      {
        name: 'Mint1155',
        version: '1',
        chainId: this.rpcProvider.chainId,
        verifyingContract: lazyERC1155Token.contract,
      },
      'Mint1155',
      {
        tokenId: lazyERC1155Token.tokenId.toString(),
        tokenURI: lazyERC1155Token.uri.toString(),
        supply: lazyERC1155Token.supply.toString(),
        creators: lazyERC1155Token.creators,
        royalties: lazyERC1155Token.royalties,
      },
      { Part: EIP712_TYPES.Part, Mint1155: EIP712_TYPES.Mint1155 },
    );
    return hash;
  }
}
