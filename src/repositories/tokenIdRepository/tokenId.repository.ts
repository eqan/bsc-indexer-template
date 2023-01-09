import { BigNumber } from '@ethersproject/bignumber';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenId } from './entities/tokenId.entity';

@Injectable()
export class TokenIdRepository {
  constructor(
    @InjectRepository(TokenId)
    private readonly tokenIdRepository: Repository<TokenId>,
    @Inject('TOKEN_ID_INITIAL_VALUE')
    private readonly tokenIdInitialValue: BigNumber,
  ) {}

  async generateTokenId(id: string): Promise<string> {
    let tokenId = await this.tokenIdRepository.findOneBy({ id });
    if (!tokenId) {
      tokenId = await this.generateTokenIdWithInitialValue(id);
    }
    tokenId.value = BigNumber.from(tokenId.value)
      .add(BigNumber.from(1))
      .toString();
    return (await this.tokenIdRepository.save(tokenId)).value;
  }
  private async generateTokenIdWithInitialValue(id: string): Promise<TokenId> {
    return this.tokenIdRepository.create({
      id,
      value: this.tokenIdInitialValue.toString(),
    });
  }
}
