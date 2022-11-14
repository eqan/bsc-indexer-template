import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from 'src/collections/collections.module';
import { Tokens } from './entities/tokens.entity';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tokens]),
    forwardRef(() => CollectionsModule)
  ],
  providers: [TokensResolver, TokensService],
  exports: [TokensService]
})
export class TokensModule {}
