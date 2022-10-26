import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { Global, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
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
        'function tokenURI(uint256 _tokenId) external view returns (string)',
        'function uri(uint256 _id) external view returns (string memory)',
      ]);

      const contract = new Contract(
        token,
        iface,
        this.rpcProvider.baseProvider,
      );

      let meta;

      const tokenURI = (await contract.uri(tokenId)) || undefined; //erc1155
      // const tokenURI = (await contract.tokenURI(tokenId)) || undefined; //erc721
      console.log(tokenURI, 'token URI of nft');

      //if tokenURI is buffered base64 encoded
      if (tokenURI?.split(',')[0] === 'data:application/json;base64') {
        meta = JSON.parse(
          Buffer.from(tokenURI?.split(',')[1], 'base64').toString('ascii'),
        );
        // console.log(decoded, 'decoed json');
      }

      //else if tokenURI is a https address like ipfs and any other central server
      else if (tokenURI?.includes('https://')) {
        // console.log('hello mai andr aya', tokenURI);

        const observable = this.httpService
          .get(tokenURI)
          .pipe(map((res) => res.data));

        meta = await lastValueFrom(observable);
        console.log(meta, 'https data');
        if (typeof meta === 'object')
          return {
            name: meta?.name || '',
            description: meta?.description || '',
            originalMetaUri: tokenURI,
            externalUri: meta?.external_url || '',
            attributes:
              meta?.attributes?.map((attribute) => {
                key: attribute?.trait_type || '';
                value: attribute?.value || '';
                type: attribute?.display_type || '';
              }) || [],
            content: {
              url: meta?.image || '',
            },
          };
        else return { message: 'unsupported format' };

        //when uri is invalid or undefined
      } else return { message: 'koi tesra case' };
    } catch (error) {
      // console.log(error);
      //if token does not exist eg, got burnt
      if (error.code === 'CALL_EXCEPTION')
        // throw new BadRequestException('Token does not exist');
        console.log('Token does not exist');
      console.log('in catch ');
      return {
        message: 'error no metadata found',
      };
      // else throw new BadRequestException(error);
    }
  }
}
