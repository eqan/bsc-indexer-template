import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Global, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { uploadImage } from '../../config/cloudinary.config';
import {
  base64toJson,
  isBase64Encoded,
  regex,
} from './../../common/utils.common';

@Injectable()
@Global()
export class MetadataApi {
  constructor(
    private rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {}

  async fetchRequest() {
    const response = await lastValueFrom(
      this.httpService.get(
        'https://graphigo.prd.galaxy.eco/metadata/0x8ab86b6fa7158d0401c2fef9aeed3d492f70e34e/31814.json',
      ),
    );
    console.log(response);
  }

  public async getTokenMetadata({
    token,
    tokenId,
  }: {
    token: string;
    tokenId: string;
  }) {
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

      let meta;

      const tokenURI = (await contract.tokenURI(tokenId)) || undefined; //erc721

      console.log(tokenURI, 'token URI of nft');

      //if tokenURI is buffered base64 encoded
      if (isBase64Encoded(tokenURI)) {
        meta = base64toJson(tokenURI);
        const url = await uploadImage(meta?.image);
        meta.image = url;
      }

      //else if tokenURI is a https address like ipfs and any other central server
      else if (tokenURI?.match(regex.url)) {
        const observable = this.httpService
          .get(tokenURI)
          .pipe(map((res) => res.data));

        meta = await lastValueFrom(observable);
        console.log(meta, 'https data');

        //when uri is invalid or undefined
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
            message: 'invalid or undefine uri',
          };
    }
  }
}
