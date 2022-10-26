import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { uploadImage } from '../../config/cloudinary.config';
import {
  base64toJson,
  ipfsDomain,
  isBase64Encoded,
  regex,
} from './../../common/utils.common';

@Injectable()
@Global()
export class MetadataApi {
  constructor(
    private rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {
    this.fetchRequest();
  }

  async fetchRequest(uri: string, id: string) {
    try {
      //replace query params
      if (uri.match(regex.query)) uri = uri?.replace(regex.query, id);
      //add ipfs domain uri
      if (uri.match(regex.ipfs)) uri = uri?.replace(regex.ipfs, ipfsDomain);
      const response = await lastValueFrom(this.httpService.get(uri));
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }

  public async getTokenMetadata({
    token,
    tokenId,
  }: {
    token: string;
    tokenId: string;
  }) {
    let tokenURI = '';
    try {
      const iface = new Interface([
        'function tokenURI(uint256 _tokenId) external view returns (string)',
        'function uri(uint256 _id) external view returns (string memory)',
      ]);

      const contract = new Contract(
        token,
        iface,
        this.rpcProvider.baseProvider,
      );

      let meta: any;

      tokenURI = (await contract.tokenURI(tokenId)) || undefined; //erc721

      //if tokenURI is buffered base64 encoded
      if (isBase64Encoded(tokenURI)) {
        meta = base64toJson(tokenURI);
        const url = await uploadImage(meta?.image);
        meta.image = url;
      }

      //else if tokenURI is a https address like ipfs and any other central server
      else if (tokenURI?.match(regex.url)) {
        meta = await this.fetchRequest(tokenURI, tokenId);
      } else throw new BadRequestException('invalid or undefined tokenURI');

      if (typeof meta === 'object')
        return {
          name: meta?.name || '',
          description: meta?.description || '',
          originalMetaUri: tokenURI,
          externalUri: meta?.external_url || '',
          attributes:
            meta?.attributes?.map((attribute: any) => ({
              key: attribute?.trait_type || '',
              value: attribute?.value || '',
              type: attribute?.display_type || '',
            })) || [],
          content: {
            url: meta?.image || '',
          },
        };
      else throw new BadRequestException('unsupported format');
    } catch (error) {
      return error.code === 'CALL_EXCEPTION'
        ? {
            message: 'Token does not exist',
          }
        : {
            message: `invalid or undefine uri ${tokenURI}`,
          };
    }
  }
}
