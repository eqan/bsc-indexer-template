import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CollectionsService } from 'src/collections/collections.service';
import { CreateCollectionsInput } from 'src/collections/dto/create-collections.input';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';
import { RpcProvider } from 'src/common/rpc-provider/rpc-provider.common';
import { CreateTokenInput } from 'src/tokens/dto/create-tokens.input';
import { MetaData } from 'src/tokens/dto/nestedObjectDto/meta.dto';
import { TokenType } from 'src/tokens/entities/enum/token.type.enum';
import { uploadImage } from '../../config/cloudinary.config';
import {
  base64toJson,
  CollectionIface,
  getCollectionName,
  getCollectionOwner,
  getCollectionSymbol,
  getNFTCreator,
  getTokenURI,
  ipfsDomain,
  isBase64Encoded,
  regex,
  TokenIface,
} from './../../common/utils.common';
@Injectable()
export class MetadataApi {
  constructor(
    @Inject(forwardRef(() => CollectionsService))
    private readonly collectionsService: CollectionsService,
    private readonly rpcProvider: RpcProvider,
    private readonly httpService: HttpService,
  ) {}

  async fetchRequest(uri: string, id: string) {
    try {
      //replace query params
      if (uri.match(regex.query)) uri = uri?.replace(regex.query, id);
      //add ipfs domain uri
      if (uri.match(regex.ipfs)) uri = uri?.replace(regex.ipfs, ipfsDomain);
      const response = await lastValueFrom(this.httpService.get(uri));
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  returnMeta(meta: any, tokenURI: string, type: TokenType) {
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
          type,
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
          content: meta?.image
            ? {
                url: meta?.image || '',
              }
            : {},
        };
      else throw new BadRequestException(`unsupported format ${tokenURI}`);
    } catch (error) {
      return { ...metadata, attribute: [], content: {} };
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
        account: [],
        value: 10000,
      },
    };

    let urlFailed = '';

    const contract = new Contract(
      collectionId,
      TokenIface,
      this.rpcProvider.baseProvider,
    );
    try {
      data.creator.account = await getNFTCreator(contract, tokenId);
      const tokenURI = await getTokenURI(type, tokenId, contract);

      if (!tokenURI) return { ...data, meta: this.returnMeta({}, '', type) };

      console.log(tokenURI);
      urlFailed = tokenURI;
      //if tokenURI is a https address like ipfs and any other central server
      if (tokenURI?.match(regex.url)) {
        const meta = await this.fetchRequest(tokenURI, tokenId);
        return { ...data, meta: this.returnMeta(meta, tokenURI, type) };
      }

      //if tokenURI is buffered base64 encoded
      if (isBase64Encoded(tokenURI)) {
        const meta = base64toJson(tokenURI);
        if (meta?.image.match(regex.base64)) {
          const url = await uploadImage(meta?.image);
          meta.image = url ?? meta.image;
        }
        return { ...data, meta: this.returnMeta(meta, tokenURI, type) };
      }
    } catch (error) {
      console.log(
        'finding issue url, remain this console',
        { type, tokenId },
        urlFailed,
        error,
      );
      return data;
    }
  }

  //CollectionMetadata
  public async getCollectionMetadata(
    collectionId: string,
    type: CollectionType,
  ) {
    const collectionData: CreateCollectionsInput = {
      name: '',
      symbol: '',
      owner: AddressZero,
      id: collectionId,
      type,
      Meta: {},
      discordUrl: '',
      twitterUserName: '',
      description: '',
    };
    try {
      const contract = new Contract(
        collectionId,
        CollectionIface,
        this.rpcProvider.baseProvider,
      );
      collectionData.name = await getCollectionName(contract);
      collectionData.symbol = await getCollectionSymbol(contract);
      collectionData.owner = await getCollectionOwner(contract);
    } catch (error) {
      console.log('error occured owner address not found');
    } finally {
      return collectionData;
    }
  }
}
