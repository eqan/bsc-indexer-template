import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { fetchCollectionQueue } from 'src/common/utils.common';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { FetchCollectionsService } from './collections.job.service';
import { FetchCollectionsProcessor } from './processors/fetch-collections.job.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: fetchCollectionQueue }),
    CollectionsModule,
    TokensModule,
    MetadataApiModule,
  ],
  providers: [
    FetchCollectionsProcessor,
    FetchCollectionsService,
    RpcProviderModule,
  ],
  exports: [FetchCollectionsService],
})
export class CollectionsJobModule {}
