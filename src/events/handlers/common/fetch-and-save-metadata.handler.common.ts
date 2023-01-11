import { Injectable, Logger } from '@nestjs/common';
import { CollectionsRegistrationService } from 'src/collectionRegistrationService/collectionRegistration.service';
import { FetchMetadataJobType } from 'src/jobs/types/job.types';
import { TokensRegistrationService } from 'src/token-registration-service/token-registration.service';

@Injectable()
export class FetchAndSaveMetadataService {
  constructor(
    private readonly collectionRegistrationService: CollectionsRegistrationService,
    private readonly tokenRegistrationService: TokensRegistrationService,
  ) {}
  private readonly logger = new Logger('FetchAndSaveMetadataService');

  async handleMetadata(data: FetchMetadataJobType) {
    try {
      const { collectionId, tokenId } = data;

      if (collectionId && tokenId) {
        const collection = await this.collectionRegistrationService.register(
          collectionId,
        );
        if (collection) {
          await this.tokenRegistrationService.register(collectionId, tokenId);
        }
      }
    } catch (error) {
      this.logger.error(`Failed Fetching Metadata: ${error}`);
      throw error;
    }
  }
}
