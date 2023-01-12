import { Module } from '@nestjs/common';
import { UrlResolver } from './url-resolver';

@Module({
  imports: [],
  providers: [UrlResolver],
  exports: [UrlResolver],
})
export class UrlResolverModule {}
