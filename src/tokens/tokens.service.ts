import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsService } from 'src/collections/collections.service';
import { ILike, Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-tokens.input';
import { FilterTokenDto } from './dto/filter-token.dto';
import { GetAllTokens } from './dto/get-all-tokens.dto';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { Tokens } from './entities/tokens.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepo: Repository<Tokens>,

    private collectionsService: CollectionsService,
  ) {}

  /**
   * Create Token in Database
   * @param createTokensInput
   * @returns  Created Token
   */
  async createToken(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const { collectionId, ...restParams } = createTokensInput;
      const token = this.tokensRepo.create(restParams);
      const collection = await this.collectionsService.getCollectionById(
        collectionId,
      );

      token.collection = collection;
      token.tokenId = collectionId + ':' + token.tokenId;

      await token.save();
      delete token.collection;
      return token;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Tokens
   * @@params No Params
   * @returns Array of Tokens and Total Number of Tokens
   */
  async findAllTokens(filterTokenDto: FilterTokenDto): Promise<GetAllTokens> {
    try {
      const { page, limit, ...rest } = filterTokenDto;
      const [items, total] = await Promise.all([
        this.tokensRepo.find({
          where: {
            tokenId: rest?.tokenId,
            name: rest?.name ? ILike(`%${rest?.name}%`) : undefined,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.tokensRepo.count({
          where: {
            tokenId: rest.tokenId,
            name: rest?.name ? ILike(`%${rest.name}%`) : undefined,
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  /**
   * GET Token By Id
   * @param id
   * @returns Token against Provided Id
   */
  async getTokenById(tokenId: string): Promise<Tokens> {
    try {
      const found = await this.tokensRepo.findOneBy({
        tokenId,
      });
      if (!found) {
        throw new NotFoundException(`Token against ${tokenId}} not found`);
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
  async updateTokenAttribute(
    updateTokensInput: UpdateTokensInput,
  ): Promise<Tokens> {
    try {
      const { tokenId, ...rest } = updateTokensInput;
      await this.tokensRepo.update({ tokenId }, rest);
      return await this.getTokenById(tokenId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * DEETE Token
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
}
