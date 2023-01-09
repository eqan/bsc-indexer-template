import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityType } from 'src/activities/entities/enums/activity.type.enum';
import { getActivityType } from 'src/common/utils.common';
import { EnhancedEvent } from 'src/events/types/events.types';
import { CreateTokenInput } from 'src/tokens/dto/create-tokens.input';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Injectable()
export class TokensRegistrationService {
  constructor(
    @Inject(forwardRef(() => TokensService))
    private readonly tokensService: TokensService,
    @InjectRepository(Tokens)
    @Inject(forwardRef(() => [MetadataApi]))
    private readonly metadataApi: MetadataApi,
  ) {}

  async register(
    collectionId: string,
    tokenId: string,
    event: EnhancedEvent,
  ): Promise<Tokens> {
    return this.getOrSaveToken(collectionId, tokenId, event);
  }

  async getOrSaveToken(
    collectionId: string,
    tokenId: string,
    event: EnhancedEvent,
  ): Promise<Tokens | null> {
    try {
      const {
        baseEventParams: { timestamp },
      } = event;
      const token = await this.tokensService.show(`${collectionId}:${tokenId}`);
      const activityType = getActivityType(event);
      if (token) {
        if (activityType !== ActivityType.BURN) return token;
        else {
          const deletedtoken = await this.tokensService.update({
            tokenId: token.tokenId,
            deleted: true,
          });
          return deletedtoken;
        }
      }

      const fetchedToken = await this.metadataApi.getTokenMetadata({
        collectionId,
        tokenId,
      });
      if (!fetchedToken) return null;
      if (activityType === ActivityType.TRANSFER) {
        fetchedToken.mintedAt = new Date(timestamp * 1000);
      } else if (activityType === ActivityType.BURN)
        fetchedToken.deleted = true;
      return this.saveOrReturn(fetchedToken);
    } catch (error) {}
  }

  async saveOrReturn(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const savedToken = this.tokensService.create(createTokensInput);
      return savedToken;
    } catch (error) {
      // need to handle dublicate enter error
      console.log('in catch', createTokensInput.tokenId);
      return this.tokensService.show(
        `${createTokensInput.collectionId}:${createTokensInput.tokenId}`,
      );
    }
  }
}
