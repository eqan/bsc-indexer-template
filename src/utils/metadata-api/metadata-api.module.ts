import { Global, Module } from '@nestjs/common';
import { MetadataApi } from './metadata-api.utils';
import { HttpModule } from '@nestjs/axios';
/**
 * @MetadataApiModule
 * global module for fetching metadata of tokens and collections
 */
@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [MetadataApi],
  exports: [MetadataApi],
})
export class MetadataApiModule {}
