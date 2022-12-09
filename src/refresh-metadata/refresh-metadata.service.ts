import { BadRequestException, Injectable } from '@nestjs/common';
import { CollectionsService } from 'src/collections/collections.service';
import { getNetworkSettings } from 'src/config/network.config';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';
import { ReturnRefreshMeta } from './dto/return.refresh-meta.dto';

/**
 * RefreshMetadata
 * @param RefreshMetadataInput
 * @returns  RefreshMetadata
 */
@Injectable()
export class RefreshMetadataService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly collectionsService: CollectionsService,
    private readonly metadataApi: MetadataApi,
  ) {}
  networkSettings = getNetworkSettings();

  async refrsehMetadata(
    collectionId: string,
    tokenId: string,
  ): Promise<ReturnRefreshMeta> {
    try {
      const collection = await this.collectionsService.collectionExistOrNot(
        collectionId,
      );

      const token = await this.tokensService.tokenExistOrNot(
        `${collectionId}:${tokenId}`,
      );

      if (collection && token) {
        const response = await this.metadataApi.getCollectionMetadata(
          collectionId,
          collection.type,
        );

        const refreshedCollection = await this.collectionsService.create(
          response,
        );

        const token = await this.tokensService.show(
          `${collectionId}:${tokenId}`,
        );

        const tokenMeta = await this.metadataApi.getTokenMetadata({
          collectionId,
          tokenId,
          type: token.type,
          timestamp: token.mintedAt.getTime() / 1000,
          deleted: token.deleted,
        });

        const refreshedToken = await this.tokensService.create(tokenMeta);
        return { collection: refreshedCollection, token: refreshedToken };
      } else throw new BadRequestException('Token or Collection Id not found');
    } catch (error) {
      throw error;
    }
  }
}
