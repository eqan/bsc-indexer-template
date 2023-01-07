import { BigNumber } from '@ethersproject/bignumber';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenId } from './entities/tokenId.entity';
import { TokenIdRepository } from './tokenId.repository';

export class TokenIdModule {
  static register(initialValue: BigNumber): DynamicModule {
    return {
      module: TokenIdModule,
      imports: [TypeOrmModule.forFeature([TokenId])],
      providers: [
        TokenIdRepository,
        {
          provide: 'TOKEN_ID_INITIAL_VALUE',
          useValue: initialValue,
        },
      ],
      exports: [TokenIdRepository],
    };
  }
}
