import { Collections } from 'src/collections/entities/collections.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsService } from 'src/collections/collections.service';
import { Repository } from 'typeorm';
import { CreateTokensInput } from './dto/create-tokens.input';
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
  async createToken(createTokensInput: CreateTokensInput): Promise<Tokens> {
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
   * @@params CollectionID
   * @returns Array of Tokens and Total Number of Tokens of that specific collection
   */
  async getAllTokensByCollectionId(collectionId: string): Promise<Tokens[]> {
    try {
      const items = await this.tokensRepo.find({
        where: { collection: { collectionId } },
      });
      if (!items) {
        throw new NotFoundException('No Tokens Found');
      }
      return items;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get All Tokens
   * @@params No Params
   * @returns Array of Tokens and Total Number of Tokens
   */
  async findAllTokens(): Promise<GetAllTokens> {
    try {
      const items = await this.tokensRepo.find();
      const total = await this.tokensRepo.count();
      if (!items) {
        throw new NotFoundException('No Tokens Found');
      }
      return { items, total };
    } catch (error) {
      throw new BadRequestException(error);
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
