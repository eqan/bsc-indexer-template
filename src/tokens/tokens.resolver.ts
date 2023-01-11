import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateTokenInput } from './dto/create-tokens.input';
import { DeleteTokensInput } from './dto/delete-tokens.input';
import { FilterTokenDto } from './dto/filter-token.dto';
import { GetAllTokens } from './dto/get-all-tokens.dto';
import { LazyTokenInput } from './dto/lazy-token-dto';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { Tokens } from './entities/tokens.entity';
import { TokensService as TokenService } from './tokens.service';

@Resolver(() => Tokens)
export class TokensResolver extends BaseProvider<Tokens | FilterTokenDto> {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  /**
   * Create Tokens
   * @param createTokenInput
   * @returns Created  Tokens
   */
  @Mutation(() => Tokens, { name: 'CreateToken' })
  async create(
    @Args('CreateTokensInput')
    createTokenInput: CreateTokenInput,
  ): Promise<Tokens> {
    try {
      return await this.tokenService.create(createTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  /**
   * Create Tokens
   * @param createTokenInput
   * @returns Created  Tokens
   */
  @Mutation(() => Tokens, { name: 'MintLazyToken' })
  async mintNftAsset(
    @Args('lazyTokenInput')
    lazyTokenInput: LazyTokenInput,
  ): Promise<Tokens> {
    try {
      return await this.tokenService.mintNftAsset(lazyTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET All Tokens
   * @returns
   */
  @Query(() => GetAllTokens, { name: 'GetAllTokens' })
  async index(
    @Args('GetAllTokensInput', { nullable: true, defaultValue: {} })
    filterTokenDto: FilterTokenDto,
  ) {
    try {
      return this.tokenService.index(filterTokenDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Token By Id
   * @param tokenId
   * @returns Token Against provided ID
   */
  @Query(() => Tokens, { name: 'GetTokenById' })
  async show(@Args('tokenId') tokenId: string): Promise<Tokens> {
    try {
      return await this.tokenService.show(tokenId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Token Attribute
   * @param updateTokenInput
   * @returns Updated Token
   */
  @Mutation(() => Tokens, { name: 'UpdateToken' })
  async edit(
    @Args('UpdateTokensInput')
    updateTokenInput: UpdateTokensInput,
  ): Promise<Tokens> {
    try {
      return await this.tokenService.update(updateTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Token
   * @param tokenId
   * @returns Nothing
   */
  @Mutation(() => Tokens, { nullable: true, name: 'DeleteToken' })
  async delete(
    @Args({
      name: 'DeleteTokenInput',
    })
    deleteTokenInput: DeleteTokensInput,
  ): Promise<void> {
    try {
      await this.tokenService.delete(deleteTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => Tokens, { name: 'ResetMetaDataofTokens', nullable: true })
  async resetMetaData(@Args('ResetMetaData') tokenId: string): Promise<void> {
    try {
      return await this.tokenService.resetMetaData(tokenId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
