import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionUniqueItems } from 'src/collections/dto/get-collectionUniqueItems.dto';
import { Collections } from 'src/collections/entities/collections.entity';
import { LazyTokenValidator } from 'src/utils/validator/mint/lazy-token-validator.utils';
import { Repository } from 'typeorm';
import { CreateTokenInput } from './dto/create-tokens.input';
import { FilterTokenAttributesDto } from './dto/filter-token-attributes.dto';
import { FilterTokenDto } from './dto/filter-token.dto';
import { GetAllTokens } from './dto/get-all-tokens.dto';
import { LazyTokenInput } from './dto/lazy-token-dto';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { TokenType } from './entities/enum/token.type.enum';
import { TokensAttributes } from './entities/nestedObjects/tokens.meta.attributes.entity';
import { TokensMeta } from './entities/nestedObjects/tokens.meta.entity';
import { Tokens } from './entities/tokens.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepo: Repository<Tokens>,
    @InjectRepository(TokensMeta)
    private tokensMetaRepo: Repository<TokensMeta>,
    @InjectRepository(Collections)
    private collectionsRepo: Repository<Collections>,
    private lazyTokenValidator: LazyTokenValidator,
    @InjectRepository(TokensAttributes)
    private tokenAttributeRepo: Repository<TokensAttributes>,
  ) {}

  /**
   * Create Token in Database
   * @param createTokensInput
   * @returns  Created Token
   */
  async create(createTokensInput: CreateTokenInput): Promise<Tokens> {
    try {
      const { collectionId, ...restParams } = createTokensInput;
      const id = collectionId + ':' + restParams.id;
      const collection = await this.collectionsRepo.findOneByOrFail({
        id: collectionId,
      });
      await this.tokensRepo.upsert(
        { ...restParams, id, collection },
        {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['id'],
        },
      );
      if (restParams?.Meta) await this.update({ id, Meta: restParams.Meta });

      const token = await this.tokensRepo.findOne({ where: { id } });
      if (token && token.Meta && restParams.Meta?.attributes?.length !== 0) {
        const attributes = restParams.Meta?.attributes?.map((attribute) => ({
          ...attribute,
          tokensMeta: token.Meta,
        }));
        await this.tokenAttributeRepo.save(attributes);
      }
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
        id: nft.tokenId,
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
   * @@params FilterTokenDto
   * @returns Array of Tokens and Total Number of Tokens
   */
  async index(filterTokenDto: FilterTokenDto): Promise<GetAllTokens> {
    try {
      const { page = 1, limit = 20, ...rest } = filterTokenDto;
      const [items, total] = await Promise.all([
        this.tokensRepo.find({
          where: {
            id: rest?.id,
            contract: rest?.contract,
            owner: rest?.owner,
          },
          order: {
            mintedAt: 'ASC' || 'DESC',
          },
          relations: { Meta: { attributes: true } },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.tokensRepo.count({
          where: {
            id: rest?.id,
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

  /**
   * Get All Tokens Attributes
   * @@params k
   * @returns Array of Tokens and Total Number of Tokens
   */
  async getTokenAttributesById(
    filterTokenAttributesDto: FilterTokenAttributesDto,
  ): Promise<CollectionUniqueItems> {
    try {
      const { collectionId, tokenId } = filterTokenAttributesDto;
      const parentQueryBuilder = this.tokenAttributeRepo
        .createQueryBuilder('TokensAttributes')
        .where('TokensAttributes.collectionId = :collectionId', {
          collectionId,
        })
        .select('TokensAttributes.key as key')
        .addSelect('COUNT(*)', 'count')
        .groupBy('key');

      const parentSubTypesQueryBuilder = this.tokenAttributeRepo
        .createQueryBuilder('TokensAttributes')
        .where('TokensAttributes.collectionId = :collectionId', {
          collectionId,
        })
        .select('DISTINCT TokensAttributes.key as parent')
        .addSelect('TokensAttributes.value as value')
        .addSelect('COUNT(*)', 'count')
        .groupBy('parent, value');

      if (collectionId) {
        parentQueryBuilder.andWhere(
          'TokensAttributes.collectionId = :collectionId',
          {
            collectionId,
          },
        );
        parentSubTypesQueryBuilder.andWhere(
          'TokensAttributes.collectionId = :collectionId',
          {
            collectionId,
          },
        );
      } else if (tokenId) {
        parentQueryBuilder.andWhere('TokensAttributes.tokenId = :tokenId', {
          tokenId,
        });
        parentSubTypesQueryBuilder.andWhere(
          'TokensAttributes.tokenId = :tokenId',
          {
            tokenId,
          },
        );
      }
      const parentValues = await parentQueryBuilder.getRawMany();
      const parentSubTypesValues =
        await parentSubTypesQueryBuilder.getRawMany();
      return { Parent: parentValues, ParentSubTypes: parentSubTypesValues };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async tokenExistOrNot(tokenId: string): Promise<Tokens> {
    try {
      return await this.tokensRepo.findOne({ where: { id: tokenId } });
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
      const found = await this.tokensRepo.findOneBy({ id: tokenId });
      if (!found) {
        return 0;
      }
      return found;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get Unique Owners Of A Collection
   * @param ContractAddress
   * @returns  Unique Owners
   */
  async getNumberOfUniqueOwners(collectionId: string): Promise<number> {
    try {
      const result = await this.tokensRepo
        .createQueryBuilder('Tokens')
        .select('Tokens.owner', 'owner')
        .where('Tokens.id = :collectionId', { collectionId })
        .groupBy('Tokens.owner')
        .getCount();
      return result + 1;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
