import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { TokensMeta } from 'src/tokens/entities/nestedObjects/tokens.meta.entity';
import { Tokens } from 'src/tokens/entities/tokens.entity';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { TokensRegistrationService } from './token-registration.service';

@Module({
  imports: [
    RpcProviderModule,
    TypeOrmModule.forFeature([Tokens, TokensMeta]),
    forwardRef(() => TokensModule),
    forwardRef(() => MetadataApiModule),
  ],
  providers: [TokensRegistrationService],
  exports: [TokensRegistrationService],
})
export class TokensRegistrationModule {}
