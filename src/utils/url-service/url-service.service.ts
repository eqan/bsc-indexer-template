import { Injectable } from '@nestjs/common';
import { UrlResource } from '../url-parser/dto/url-parser.dto';
import { UrlParser } from '../url-parser/url-parser-service';
import { UrlResolver } from '../url-resolver/url-resolver';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlParser: UrlParser,
    private readonly urlResolver: UrlResolver,
  ) {}

  async resolveInternalHttpUrl(url: string): Promise<string | null> {
    const resource = this.urlParser.parse(url);
    return resource ? this.urlResolver.resolveInternalUrl(resource) : null;
  }

  async resolvePublicHttpUrl(url: string): Promise<string | null> {
    const resource = this.urlParser.parse(url);
    return resource ? this.urlResolver.resolvePublicUrl(resource) : null;
  }

  async parseUrl(url: string, id: string): Promise<UrlResource | null> {
    const resource = this.urlParser.parse(url);
    // if (!resource) {
    //   logMetaLoading(
    //     id,
    //     `UrlService: Cannot parse and resolve url: ${url}`,
    //     true,
    //   );
    // }
    return resource;
  }
}
