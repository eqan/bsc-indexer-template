import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
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

  returnMeta(Meta: any, tokenURI: string, tokenId: string, collectionId) {
    const metadata: MetaData = {
      name: '',
      description: '',
      tags: [],
      genres: [],
      originalMetaUri: tokenURI,
      externalUri: '',
      attributes: [
        {
          tokenId: '',
          collectionId: '',
          key: '',
          value: '',
          format: '',
        },
      ],
      Content: {
        fileName: '',
        url: '',
        representation: '',
      },
    };
    try {
      // console.log(Meta.attributes);
      // console.log('This is:', Meta);
      if (typeof Meta === 'object') {
        const data = {
          ...metadata,
          name: Meta?.name || '',
          description: Meta?.description || '',
          originalMetaUri: tokenURI,
          externalUri: Meta?.external_url || '',
          attributes:
            Meta?.attributes?.map((attribute: any) => ({
              tokenId,
              collectionId,
              key: attribute?.trait_type.trim() || '',
              value: attribute?.value.trim() || '',
              format: attribute?.display_type || '',
            })) || [],
          Content: Meta?.image
            ? {
                url: Meta?.image || '',
              }
            : {},
        };
        // console.log('This is:', data);
        // console.log(data);
        return data;
      } else throw new BadRequestException(`unsupported format ${tokenURI}`);
    } catch (error) {
      return { ...metadata, attributes: [], Content: {} };
    }
  }

  public async getTokenMetadata({
    collectionId,
    tokenId,
    type,
    timestamp,
    deleted,
  }: {
    collectionId: string;
    tokenId: string;
    type: TokenType;
    timestamp: number;
    deleted: boolean;
  }) {
    const data: CreateTokenInput = {
      id: tokenId,
      type,
      collectionId,
      contract: collectionId,
      deleted,
      mintedAt: new Date(timestamp * 1000),
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
    const newTokenId = collectionId + ':' + tokenId;
    try {
      data.creator.account = await getNFTCreator(contract, tokenId);
      const tokenURI = await getTokenURI(type, tokenId, contract);

      if (!tokenURI) return { ...data, Meta: this.returnMeta({}, '', '', '') };

      // console.log(tokenURI);
      urlFailed = tokenURI;
      //if tokenURI is a https address like ipfs and any other central server
      if (tokenURI?.match(regex.url)) {
        const Meta = await this.fetchRequest(tokenURI, tokenId);
        return {
          ...data,
          Meta: this.returnMeta(Meta, tokenURI, newTokenId, collectionId),
        };
      }

      //else if tokenURI is buffered base64 encoded
      else if (isBase64Encoded(tokenURI)) {
        const Meta = base64toJson(tokenURI);
        if (Meta?.image.match(regex.base64)) {
          const url = await uploadImage(Meta?.image);
          Meta.image = url ?? Meta.image;
        }
        return {
          ...data,
          Meta: this.returnMeta(Meta, tokenURI, newTokenId, collectionId),
        };
      } else {
        return {
          ...data,
          Meta: this.returnMeta({}, tokenURI, newTokenId, collectionId),
        };
      }
    } catch (error) {
      console.log(
        'finding issue url, remain this console',
        { type, tokenId, collectionId },
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
  ): Promise<CreateCollectionsInput> {
    const collectionData: CreateCollectionsInput = {
      name: '',
      symbol: '',
      owner: AddressZero,
      id: collectionId,
      type,
      Meta: {},
      discordUrl: '',
      twitterUrl: '',
      description: '',
    };
    let name;
    let symbol;
    let owner;
    try {
      const contract = new Contract(
        collectionId,
        CollectionIface,
        this.rpcProvider.baseProvider,
      );
      name = await getCollectionName(contract);
      symbol = await getCollectionSymbol(contract);
      owner = await getCollectionOwner(contract);
    } catch (error) {
      console.log('error occured owner address not found');
    } finally {
      return {
        name,
        symbol,
        owner,
        id: collectionId,
        type,
        Meta: { name },
        discordUrl: '',
        twitterUrl: '',
        description: '',
      };
    }
  }
}
