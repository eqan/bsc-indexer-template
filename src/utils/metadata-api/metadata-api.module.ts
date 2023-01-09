import { HttpModule } from '@nestjs/axios';
import { forwardRef, Global, Module } from '@nestjs/common';
import { CollectionsModule } from 'src/collections/collections.module';
import { MetadataApi } from './metadata-api.utils';

/**
 * @MetadataApiModule
 * global module for fetching metadata of tokens and collections
 */
@Global()
@Module({
  imports: [
    forwardRef(() => CollectionsModule),
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
