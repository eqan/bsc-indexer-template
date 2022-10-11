import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateTokensInput as CreateTokenInput } from './dto/create-tokens.input';
import { DeleteTokensInput } from './dto/delete-tokens.input';
import { UpdateTokensInput } from './dto/update-tokens.input';
import { Tokens as Token } from './entities/tokens.entity';
import { TokensService as TokenService } from './tokens.service';

@Resolver(() => Token)
export class TokensResolver extends BaseProvider<Token> {
  constructor(private readonly tokenService: TokenService) {
    super();
  }

  /**
   * Create Tokens
   * @param createTokenInput
   * @returns Created  Tokens
   */
  @Mutation(() => Token, { name: 'createToken' })
  create(
    @Args('createTokenInput')
    createTokenInput: CreateTokenInput,
  ) {
    return this.tokenService.createToken(createTokenInput);
  }

  /**
   * GET All Tokens
   * @returns
   */
  @Query((returns) => [[Token], Number])
  async index() {
    return this.tokenService.findAllTokens();
  }

  /**
   * GET Token By Id
   * @param tokenId
   * @returns Token Against provided ID
   */
  @Query(() => Token, { name: 'showTokenById' })
  show(@Args('tokenId') tokenId: string) {
    return this.tokenService.getTokenById(tokenId);
  }

  /**
   * Update Token Attribute
   * @param updateTokenInput
   * @returns Updated Token
   */
  @Mutation(() => Token, { name: 'updateTokenAttribute' })
  edit(
    @Args('updateTokensInput')
    updateTokenInput: UpdateTokensInput,
  ) {
    return this.tokenService.updateTokenAttribute(updateTokenInput);
  }

  /**
   * Remove Token
   * @param tokenId
   * @returns Nothing
   */
  @Mutation(() => Token, { nullable: true })
  delete(
    @Args({
      name: 'deleteTokenInput',
    })
    deleteTokenInput: DeleteTokensInput,
  ): void {
    this.tokenService.delete(deleteTokenInput);
  }
}
