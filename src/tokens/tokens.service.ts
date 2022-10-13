import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  /**
   * Create Token in Database
   * @param createTokensInput
   * @returns  Created Token
   */
  async createToken(createTokensInput: CreateTokensInput): Promise<Tokens> {
    try {
      const token = this.tokensRepo.create(createTokensInput);

      return await token.save();
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
  async getTokenById(tokenContract: string): Promise<Tokens> {
    try {
      const found = await this.tokensRepo.findOneBy({
        tokenContract,
      });
      if (!found) {
        throw new NotFoundException(
          `Token against ${tokenContract}} not found`,
        );
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
      const { tokenContract, ...rest } = updateTokensInput;
      await this.tokensRepo.update({ tokenContract }, rest);
      return await this.getTokenById(tokenContract);
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
