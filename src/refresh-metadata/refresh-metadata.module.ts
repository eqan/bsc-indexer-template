import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { RefreshMetadataResolver } from './refresh-metadata.resolver';
import { RefreshMetadataService } from './refresh-metadata.service';

@Module({
  imports: [TokensModule, CollectionsModule, MetadataApiModule],
  providers: [
    RpcProviderModule,
    RefreshMetadataService,
    RefreshMetadataResolver,
  ],
})
export class RefreshMetadataModule {}
