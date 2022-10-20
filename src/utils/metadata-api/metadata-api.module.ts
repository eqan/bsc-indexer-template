import { Global, Module } from '@nestjs/common';
import { MetadataApi } from './metadata-api.utils';

/**
 * @MetadataApiModule
 * global module for fetching metadata of tokens and collections
 */
@Global()
@Module({ providers: [MetadataApi], exports: [MetadataApi] })
export class MetadataApiModule {}
