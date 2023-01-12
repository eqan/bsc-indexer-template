import { Module } from '@nestjs/common';
import { UrlParserModule } from '../url-parser/url-parser.module';
import { UrlResolverModule } from '../url-resolver/url-resolver.module';
import { UrlService } from './url-service.service';

@Module({
  imports: [UrlParserModule, UrlResolverModule],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlServiceModule {}
