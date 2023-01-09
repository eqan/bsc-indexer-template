import { Injectable, Logger } from '@nestjs/common';
import { CollectionsRegistrationService } from 'src/CollectionRegistrationService/collectionRegistration.service';
import { FetchMetadataJobType } from 'src/jobs/types/job.types';
import { TokensRegistrationService } from 'src/token-registration-service/token-registration.service';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Injectable()
export class FetchAndSaveMetadataService {
  constructor(
    private readonly collectionRegistrationService: CollectionsRegistrationService,
    private readonly tokenRegistrationService: TokensRegistrationService,
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
  ) {}
  private readonly logger = new Logger('FetchAndSaveMetadataService');

  async handleMetadata(data: FetchMetadataJobType) {
    try {
      const { collectionId, tokenId, event } = data;

      if (collectionId && tokenId) {
        const collection = await this.collectionRegistrationService.register(
          collectionId,
        );
        if (collection) {
          await this.tokenRegistrationService.register(
            collectionId,
            tokenId,
            event,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Failed Fetching Metadata: ${error}`);
      throw error;
    }
  }
}
