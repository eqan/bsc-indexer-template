import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { SyncEventsModule } from 'src/events/sync-events/sync-events.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { QueueType } from '../enums/jobs.enums';
import { RefreshMetadataResolver } from '../resolvers/refresh-metadata.job.resolver';
import { RefreshMetadataProcessor } from './processor/refresh-metadata.job.processor';
import { RefreshMetadataService } from './refresh-metadata.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.REFRESH_METADATA_QUEUE }),
    SyncEventsModule,
    TokensModule,
    CollectionsModule,
    MetadataApiModule,
  ],
  providers: [
    RpcProviderModule,
    RefreshMetadataService,
    RefreshMetadataProcessor,
    RefreshMetadataResolver,
  ],
})
export class RefreshMetadataModule {}
