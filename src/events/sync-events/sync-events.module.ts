import { Module } from '@nestjs/common';
import { ActivitiesModule } from 'src/activities/activities.module';
import { RpcProviderModule } from 'src/common/rpc-provider/rpc-provider.module';
import { CollectionsJobModule } from 'src/jobs/collections/collections.job.module';
import { ERC1155Handler } from '../handlers/erc721/erc1155/erc1155.handler';
import { ERC721Handler } from '../handlers/erc721/erc721.handler';
import { SyncEventsService } from './sync-events.service';

@Module({
  imports: [CollectionsJobModule, RpcProviderModule, ActivitiesModule],
  providers: [SyncEventsService, ERC721Handler, ERC1155Handler],
  exports: [SyncEventsService],
})
export class SyncEventsModule {}
