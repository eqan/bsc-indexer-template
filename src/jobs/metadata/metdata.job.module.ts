import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { MetadataApiModule } from 'src/utils/metadata-api/metadata-api.module';
import { QueueType } from '../enums/jobs.enums';
import { FetchMetadataService } from './metdata.job.service';
import { FetchMetadataProcessor } from './processors/fetch-metdata.job.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueType.FETCH_METADATA_QUEUE }),
    CollectionsModule,
    TokensModule,
    MetadataApiModule,
  ],
  providers: [FetchMetadataProcessor, FetchMetadataService, RpcProviderModule],
  exports: [FetchMetadataService],
})
export class MetadataJobModule {}
