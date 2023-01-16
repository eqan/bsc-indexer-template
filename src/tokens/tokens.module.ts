import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collections } from 'src/collections/entities/collections.entity';
import { MintModule } from 'src/utils/validator/mint/mint-module';
import { TokensAttributes } from './entities/nestedObjects/tokens.meta.attributes.entity';
import { TokensMeta } from './entities/nestedObjects/tokens.meta.entity';
import { Tokens } from './entities/tokens.entity';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [
<<<<<<< HEAD
    TypeOrmModule.forFeature([Tokens, TokensMeta, TokensAttributes]),
    forwardRef(() => CollectionsModule),
=======
    TypeOrmModule.forFeature([Tokens, TokensMeta]),
    TypeOrmModule.forFeature([Collections]),
>>>>>>> b35831885577256e8ef13a55d0e64fc4ac9d27e7
    MintModule,
  ],
  providers: [TokensResolver, TokensService],
  exports: [TokensService],
})
export class TokensModule {}
