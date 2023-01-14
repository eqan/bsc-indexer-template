import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTokenInput } from 'src/tokens/dto/create-tokens.input';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { MetadataApi } from 'src/utils/metadata-api/metadata-api.utils';

@Injectable()
export class TokensRegistrationService {
  constructor(
    @Inject(forwardRef(() => TokensService))
    private readonly tokensService: TokensService,
    private readonly metadataApi: MetadataApi,
  ) {}

  async register(collectionId: string, tokenId: string): Promise<Tokens> {
    return this.getOrSaveToken(collectionId, tokenId);
  }

  async getOrSaveToken(collectionId: string, tokenId: string): Promise<Tokens> {
    const token = await this.tokensService.tokenExistOrNot(
      `${collectionId}:${tokenId}`,
    );
    if (token) return token;
    const fetchedToken = await this.metadataApi.getTokenMetadata({
      collectionId,
      tokenId,
    });
    return this.saveOrReturn(fetchedToken);
  }

  async saveOrReturn(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const savedToken = await this.tokensService.create(createTokensInput);
      return savedToken;
    } catch (error) {
      console.log(error, 'error duplication');
      // need to handle dublicate enter error
      return this.tokensService.show(
        `${createTokensInput.collectionId}:${createTokensInput.id}`,
      );
    }
  }
}
