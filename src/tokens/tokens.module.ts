import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { TokensResolver } from './tokens.resolver';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tokens])],
  providers: [TokensResolver, TokensService],
})
export class TokensModule {}
