import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { uploadImage } from '../../config/cloudinary.config';
import { AddressZero } from '@ethersproject/constants';
import {
  base64toJson,
  ipfsDomain,
  isBase64Encoded,
  regex,
} from './../../common/utils.common';
import { MetaData } from 'src/tokens/dto/nestedObjectDto/meta.dto';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import { CollectionsService } from 'src/collections/collections.service';
import { CreateCollectionsInput } from 'src/collections/dto/create-collections.input';
import { CreateTokenInput } from 'src/tokens/dto/create-tokens.input';
@Injectable()
export class MetadataApi {
  constructor(
    @Inject(forwardRef(() => CollectionsService))
    private readonly collectionsService: CollectionsService,
    private rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {
    this.collectionsService
      .findAllCollections({})
      .then(console.log)
      .catch(console.log);
  }

  async fetchRequest(uri: string, id: string) {
    try {
      //replace query params
      if (uri.match(regex.query)) uri = uri?.replace(regex.query, id);
      //add ipfs domain uri
      if (uri.match(regex.ipfs)) uri = uri?.replace(regex.ipfs, ipfsDomain);
      const response = await lastValueFrom(this.httpService.get(uri));
      return this.returnMeta(response.data, uri);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  returnMeta(meta: any, tokenURI: string) {
    const metadata: MetaData = {
      name: '',
      description: '',
      tags: [],
      genres: [],
      originalMetaUri: tokenURI,
      externalUri: '',
      attribute: [
        {
          key: '',
          value: '',
          type: TokenType.BEP721,
          format: '',
        },
      ],
      content: {
        fileName: '',
        url: '',
        representation: '',
      },
    };
    try {
      if (typeof meta === 'object')
        return {
          ...metadata,
          name: meta?.name || '',
          description: meta?.description || '',
          originalMetaUri: tokenURI,
          externalUri: meta?.external_url || '',
          attribute:
            meta?.attributes?.map((attribute: any) => ({
              key: attribute?.trait_type || '',
              value: attribute?.value || '',
              type: TokenType.BEP721,
              format: attribute?.display_type || '',
            })) || [],
          content: {
            url: meta?.image || '',
          },
        };
      else throw new BadRequestException(`unsupported format ${tokenURI}`);
    } catch (error) {
      return metadata;
    }
  }

  public async getTokenMetadata({
    collectionId,
    tokenId,
    type,
    timestamp,
  }: {
    collectionId: string;
    tokenId: string;
    type: TokenType;
    timestamp: number;
  }) {
    const data: CreateTokenInput = {
      tokenId,
      collectionId,
      contract: collectionId,
      deleted: false,
      mintedAt: new Date(timestamp),
      lastUpdatedAt: new Date(),
      sellers: 0,
      creator: {
        account: AddressZero,
        value: 10000,
      },
      meta: {
        name: '',
        description: '',
        tags: [],
        genres: [],
        originalMetaUri: '',
        externalUri: '',
        attribute: [
          {
            key: '',
            value: '',
            type,
            format: '',
          },
        ],
        content: {
          fileName: '',
          url: '',
          representation: '',
        },
      },
    };

    try {
      const iface = new Interface([
        'function tokenURI(uint256 _tokenId) external view returns (string)',
        'function uri(uint256 _id) external view returns (string memory)',
        'function ownerOf(uint256 _tokenId) external view returns (address)',
      ]);

      const contract = new Contract(
        collectionId,
        iface,
        this.rpcProvider.baseProvider,
      );

      const creator = await contract.ownerOf(tokenId);
      data.creator = creator;

      const tokenURI = (await contract.tokenURI(tokenId)) || undefined; //erc721
      data.meta.originalMetaUri = tokenURI;

      if (!tokenURI) throw new BadRequestException('Undefined tokenURI');

      //if tokenURI is a https address like ipfs and any other central server
      if (tokenURI?.match(regex.url)) {
        const meta = await this.fetchRequest(tokenURI, tokenId);
        return { ...data, meta };
        // data.meta = meta;
        // return this.returnMeta(meta, tokenURI);
      }

      //if tokenURI is buffered base64 encoded
      if (isBase64Encoded(tokenURI)) {
        const meta = base64toJson(tokenURI);
        if (meta?.image.match(regex.base64)) {
          const url = await uploadImage(meta?.image);
          meta.image = url ?? meta.image;
        }
        const metadata = this.returnMeta(meta, tokenURI);
        return { ...data, metadata };
      }
    } catch (error) {
      if (
        error.code === 'CALL_EXCEPTION' &&
        error.reason === 'ERC721Metadata: URI query for nonexistent token'
      ) {
        data.deleted = true;
        console.log('Token does not exist');
        return data;
      } else
        console.log(`invalid or undefine uri ${data.meta.originalMetaUri}`);
      return data;
    }
  }

  public async getCollectionMetadata(
    collectionId: string,
    type: CollectionType,
  ) {
    const iface = new Interface([
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function owner() public view returns (address)',
    ]);
    const collectionData: CreateCollectionsInput = {
      name: '',
      symbol: '',
      owner: AddressZero,
      collectionId,
      type,
      meta: {
        name: '',
        description: '',
        content: {
          type: '',
          url: '',
          representation: '',
        },
        externalLink: '',
        sellerFeeBasisPoints: 0,
        feeRecipient: '',
      },
    };
    const contract = new Contract(
      collectionId,
      iface,
      this.rpcProvider.baseProvider,
    );
    try {
      const name = await contract.name();
      collectionData.name = name;
      const symbol = await contract.symbol();
      collectionData.symbol = symbol;
      const owner = await contract.owner();
      collectionData.owner = owner;
    } catch (error) {
      console.log('error occured owner address not found');
    } finally {
      return collectionData;
    }
  }
}
