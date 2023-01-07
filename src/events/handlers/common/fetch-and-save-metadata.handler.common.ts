import { Injectable, Logger } from '@nestjs/common';
import { CollectionsService } from 'src/collections/collections.service';
import { getTypes } from 'src/common/utils.common';
import { FetchMetadataJobType } from 'src/jobs/types/job.types';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Injectable()
export class FetchAndSaveMetadataService {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
  ) {}
  private readonly logger = new Logger('FetchAndSaveMetadataService');

  async handleMetadata(data: FetchMetadataJobType) {
    try {
      const { collectionId, tokenId, timestamp, kind, deleted } = data;
      const { collectionType, type } = getTypes(kind);

      if (collectionId && tokenId) {
        const collection = await this.collectionsService.collectionExistOrNot(
          collectionId,
        );
        const token = await this.tokensService.tokenExistOrNot(tokenId);

        if (!collection) {
          const response = await this.metadataApi.getCollectionMetadata(
            collectionId,
            collectionType,
          );
          await this.collectionsService.create(response);
        }

        if (!token) {
          try {
            const tokenMeta = await this.metadataApi.getTokenMetadata({
              collectionId,
              tokenId,
              type,
              timestamp,
              deleted,
            });

            if (!tokenMeta.Meta || !tokenMeta.Meta.name) {
              tokenMeta.Meta = null;
            }

            await this.tokensService.create(tokenMeta);
          } catch (err) {
            console.log(err, collectionId);
            throw err;
          }
        }
      }
    } catch (error) {
      this.logger.error(`Failed Fetching Metadata: ${error}`);
      throw error;
    }
  }
}
