import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsService } from 'src/collections/collections.service';
import { Repository } from 'typeorm';
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
    private collectionsService: CollectionsService, // private orderMatchEventService: OrderMatchEventService, // private readonly moduleRef: ModuleRef, // @Inject(OrderMatchEventService) // private orderMatchEventService: OrderMatchEventService,
  ) {}

  /**
   * Create Token in Database
   * @param createTokensInput
   * @returns  Created Token
   */
  async create(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const { collectionId, ...restParams } = createTokensInput;
      // console.log(restParams);
      const token = this.tokensRepo.create(restParams);
      const collection = await this.collectionsService.show(collectionId);

      token.collection = collection;
      token.id = collectionId + ':' + token.id;

      // console.log(token);
      await token.save();
      console.log('This is: ', token.Meta.attributes);
      // console.log(token);
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
  async index(filterTokenDto: FilterTokenDto): Promise<GetAllTokens> {
    try {
      const { page = 1, limit = 20, ...rest } = filterTokenDto;
      const [items, total] = await Promise.all([
        this.tokensRepo.find({
          where: {
            id: rest?.tokenId,
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
            id: rest?.tokenId,
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
      return await this.tokensRepo.findOne({ where: { id: tokenId } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Token By Id
   * @param id
   * @returns Token against Provided Id
   */
  async show(tokenId: string): Promise<Tokens> {
    try {
      const found = await this.tokensRepo.findOneBy({
        id: tokenId,
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
}
