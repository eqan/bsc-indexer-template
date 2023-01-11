import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsService } from 'src/collections/collections.service';
import { LazyTokenValidator } from 'src/utils/validator/mint/lazy-token-validator.utils';
import { Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-tokens.input';
import { FilterTokenDto } from './dto/filter-token.dto';
import { GetAllTokens } from './dto/get-all-tokens.dto';
import { LazyTokenInput } from './dto/lazy-token-dto';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { TokenType } from './entities/enum/token.type.enum';
import { Tokens } from './entities/tokens.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepo: Repository<Tokens>,
    private collectionsService: CollectionsService,
    private lazyTokenValidator: LazyTokenValidator,
  ) {}

  /**
   * Create Token in Database
   * @param createTokensInput
   * @returns  Created Token
   */
  async create(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const { collectionId, ...restParams } = createTokensInput;
      const collection = await this.collectionsService.show(collectionId);
      const tokenId = collectionId + ':' + restParams.tokenId;
      await this.tokensRepo.upsert(
        { ...restParams, tokenId, collection },
        {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['tokenId'],
        },
      );
      const token = await this.tokensRepo.findOne({ where: { tokenId } });
      return token;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async mintNftAsset(lazyNftToken: LazyTokenInput): Promise<Tokens> {
    try {
      await this.lazyTokenValidator.validate(lazyNftToken);
      const nft = lazyNftToken.erc721
        ? lazyNftToken.erc721
        : lazyNftToken.erc1155;
      const args: CreateTokenInput = {
        tokenId: nft.tokenId,
        sellers: 0,
        collectionId: nft.contract,
        contract: nft.contract,
        deleted: false,
        type: lazyNftToken.erc721 ? TokenType.BEP721 : TokenType.BEP1155,
      };
      return this.create(args);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Tokens
   * @@params No Params
   * @returns Array of Tokens and Total Number of Tokens
   */
  async index(filterTokenDto: FilterTokenDto): Promise<GetAllTokens> {
    try {
      const { page = 1, limit = 20, ...rest } = filterTokenDto;
      const [items, total] = await Promise.all([
        this.tokensRepo.find({
          where: {
            tokenId: rest?.tokenId,
            contract: rest?.contract,
            owner: rest?.owner,
          },
          order: {
            mintedAt: 'ASC' || 'DESC',
          },
          relations: { Meta: true },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.tokensRepo.count({
          where: {
            tokenId: rest?.tokenId,
            contract: rest?.contract,
            owner: rest?.owner,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async tokenExistOrNot(tokenId: string): Promise<Tokens> {
    try {
      return await this.tokensRepo.findOne({ where: { tokenId } });
    } catch (error) {
      console.log(error, 'errro in tokenexist');
      throw new BadRequestException(error);
    }
  }
  /**
   * GET Token By Id
   * @param id
   * @returns Token against Provided Id if not found throws exception
   */
  async show(tokenId: string): Promise<Tokens> {
    try {
      const found = await this.tokensRepo.findOneBy({
        tokenId,
      });
      if (!found) {
        throw new NotFoundException(`Token against ${tokenId} not found`);
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Tokens Atributes
   * @param updateTokensInput
   * @returns
   */
  async update(updateTokensInput: UpdateTokensInput): Promise<Tokens> {
    try {
      return await this.tokensRepo.save(updateTokensInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Token
   * @param tokenIds
   * @returns
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      const values = await this.tokensRepo.delete(ids);

      if (!values) {
        throw new NotFoundException('Token not found');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Reset Token Meta
   * @param tokenId
   * @returns  Nothing
   */
  async resetMetaData(tokenId: string): Promise<void> {
    try {
      await this.tokensRepo.update(tokenId, { Meta: null });
      return null;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  /**
   * GET Token By Id
   * @param id
   * @returns Token against Provided Id if not found simply returns
   */
  async find(tokenId: string): Promise<Tokens | 0> {
    try {
      const found = await this.tokensRepo.findOneBy({
        tokenId,
      });
      if (!found) {
        return 0;
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
