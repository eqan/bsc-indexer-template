import { BadRequestException, Body } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateTokensInput as CreateTokenInput } from './dto/create-tokens.input';
import { DeleteTokensInput } from './dto/delete-tokens.input';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { Tokens } from './entities/tokens.entity';
import { TokensService as TokenService } from './tokens.service';

@Resolver(() => Tokens)
export class TokensResolver extends BaseProvider<Tokens> {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  /**
   * Create Tokens
   * @param createTokenInput
   * @returns Created  Tokens
   */
  @Mutation(() => Tokens, { name: 'createToken' })
  async create(
    @Args('createTokenInput')
    @Body()
    createTokenInput: CreateTokenInput,
  ): Promise<Tokens> {
    try {
      return await this.tokenService.createToken(createTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET All Tokens
   * @returns
   */
  @Query((returns) => [[Tokens], Number])
  async index() {
    try {
      return this.tokenService.findAllTokens();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * GET Token By Id
   * @param tokenId
   * @returns Token Against provided ID
   */
  @Query(() => Tokens, { name: 'showTokenById' })
  async show(@Args('tokenId') tokenId: string): Promise<Tokens> {
    try {
      return await this.tokenService.getTokenById(tokenId);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Update Token Attribute
   * @param updateTokenInput
   * @returns Updated Token
   */
  @Mutation(() => Tokens, { name: 'updateTokenAttribute' })
  async edit(
    @Args('updateTokensInput')
    updateTokenInput: UpdateTokensInput,
  ): Promise<Tokens> {
    try {
      return await this.tokenService.updateTokenAttribute(updateTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Remove Token
   * @param tokenId
   * @returns Nothing
   */
  @Mutation(() => Tokens, { nullable: true })
  async delete(
    @Args({
      name: 'deleteTokenInput',
    })
    deleteTokenInput: DeleteTokensInput,
  ): Promise<void> {
    try {
      await this.tokenService.delete(deleteTokenInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
