import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
@Injectable()
@Global()
export class MetadataApi {
  constructor(
    private rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {}

  public async getTokenMetadata({
    token,
    tokenId,
  }: {
    token: string;
    tokenId: string;
  }) {
    try {
      console.log('called', token);

      const iface = new Interface([
        'function ownerOf(uint256 _tokenId) external view returns (address)',
        'function tokenURI(uint256 _tokenId) external view returns (string)',
      ]);

      const contract = new Contract(
        token,
        iface,
        this.rpcProvider.baseProvider,
      );
      const tokenURI = await contract.tokenURI(tokenId);
      console.log(tokenURI, 'token URI of nft');

      //if tokenURI is buffered base64 encoded
      if (tokenURI?.split(',')?.[0] === 'data:application/json;base64') {
        console.log('json decoded');

        const decoded = JSON.parse(
          Buffer.from(tokenURI?.split(',')[1], 'base64').toString('ascii'),
        );
        console.log(decoded, 'decoed json');
      }
      //else if tokenURI is a https address like ipfs and any other central server
      else if (tokenURI?.includes('https://')) {
        console.log('hello mai andr aya', tokenURI);
        const metda = await this.httpService.get(tokenURI);
        console.log(metda, 'https data');
      } else console.log(tokenURI, 'koi teesra case');
    } catch (error) {
      console.log(error);
      //if token does not exist eg, got burnt
      if (error.code === 'CALL_EXCEPTION')
        // throw new BadRequestException('Token does not exist');
        console.log('Token does not exist');

      // else throw new BadRequestException(error);
    }
    // tokenId: string,
    // collectionId?: string,
    // contract?: string,
    // mintedAt: Date,
    // lastUpdatedAt: Date,
    // deleted: boolean,
    // sellers: number,
    // creator: {
    //   account: string,
    //   value: number,
    // },
    // meta?: {
    //   name: string,
    //   description?: string,
    //   tags?: string[],
    //   genres?: string[],
    //   originalMetaUri: string,
    //   externalUri?: string,
    //   rightsUri?: string,
    //   attributes: {
    //     key: string,
    //     value: number,
    //     type?: TokenType,
    //     format?: string,
    //   },
    //   content?: {
    //     fileName?: string,
    //     url?: string,
    //     representation?: string,
    //     mimeType?: string,
    //     size?: number,
    //     available?: boolean,
    //     type?: string,
    //     width?: number,
    //     height?: number,
    //   },
    // },

    // const tokenMetadata: {
    //   contract: string,
    //   tokenId: string,
    //   flagged: boolean,
    //   name?: string,
    //   description?: string,
    //   imageUrl?: string,
    //   mediaUrl?: string,
    //   attributes: {
    //     key: string,
    //     value: string,
    //     kind: 'string' | 'number' | 'date' | 'range',
    //     rank?: number,
    //   }[],
    // }[] = (data as any).metadata,
    // return tokenMetadata,
  }
}

// export { MetadataApi as default },
