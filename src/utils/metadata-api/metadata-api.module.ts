import { Global, Module } from '@nestjs/common';
import { MetadataApi } from './metadata-api.utils';
import { HttpModule } from '@nestjs/axios';
import { CollectionsModule } from 'src/collections/collections.module';

/**
 * @MetadataApiModule
 * global module for fetching metadata of tokens and collections
 */
@Global()
@Module({
  imports: [
    CollectionsModule,

    HttpModule.register({
      //increased timeout to 2 mins for fetching data from ipfs
      timeout: 120000,
      maxRedirects: 5,
    }),
  ],
  providers: [MetadataApi],
  exports: [MetadataApi],
})
export class MetadataApiModule {}
