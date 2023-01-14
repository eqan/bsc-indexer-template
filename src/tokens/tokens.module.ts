import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from 'src/collections/collections.module';
import { MintModule } from 'src/utils/validator/mint/mint-module';
import { TokensAttributes } from './entities/nestedObjects/tokens.meta.attributes.entity';
import { TokensMeta } from './entities/nestedObjects/tokens.meta.entity';
import { Tokens } from './entities/tokens.entity';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tokens, TokensMeta, TokensAttributes]),
    forwardRef(() => CollectionsModule),
    MintModule,
  ],
  providers: [TokensResolver, TokensService],
  exports: [TokensService],
})
export class TokensModule {}
